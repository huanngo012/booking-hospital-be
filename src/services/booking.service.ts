import mongoose, { ClientSession } from 'mongoose'
import { BadRequestError, NotFoundError } from '~/core/error.response'
import { BookingModel } from '~/models/Booking'
import { Booking, BookingBody, BookingFiles, BookingQueryParams, UpdateBookingBody } from '~/types/booking.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { validatePatient, validateUserManagePatient } from '~/validations/patient.validation'
import ImageService from './image.service'
import { BookingStatus, CloudinaryFolder } from '~/constants/enums'
import { ScheduleModel } from '~/models/Schedule'

const BookingService = {
  getBookingsService: async (userId: string, queries: BookingQueryParams) => {
    const { limit, sort, page, fields, ...filter } = queries

    const pipeline = buildAggregateQuery({
      filter: {
        deletedAt: null,
        ...filter
      },
      sort,
      fields,
      page,
      limit
    })

    const response = await BookingModel.aggregate(pipeline)
    return formatAggregateResult<Booking>(response, page, limit)
  },

  getBookingByIdService: async (userId: string, _id: string) => {
    const response = await BookingModel.findOne({ _id })
    if (!response) {
      throw new NotFoundError('Lịch đặt không tồn tại')
    }
    return response
  },

  createBookingService: async (userId: string, payload: BookingBody, files?: BookingFiles) => {
    const session = await mongoose.startSession()

    return session.withTransaction(async () => {
      const { patientID, scheduleID, timeSlot } = payload

      await validatePatient(patientID)
      await validateUserManagePatient(patientID, userId)

      const schedule = await ScheduleModel.findById(scheduleID).select('date doctorID').session(session)

      if (!schedule) throw new BadRequestError('Lịch khám không tồn tại')

      const duplicate = await BookingModel.exists({
        patientID,
        date: schedule.date,
        timeSlot,
        status: { $ne: BookingStatus.CANCELLED }
      }).session(session)

      if (duplicate) throw new BadRequestError('Bạn đã có lịch khám cùng ngày và khung giờ này')

      const updated = await ScheduleModel.findOneAndUpdate(
        {
          _id: scheduleID,
          timeSlots: {
            $elemMatch: {
              time: timeSlot,
              $expr: { $lt: ['$bookedCount', '$maxNumber'] }
            }
          }
        },
        { $inc: { 'timeSlots.$.bookedCount': 1 } },
        { session }
      )

      if (!updated) throw new BadRequestError('Khung giờ này đã đầy')

      if (files?.descriptionImages) {
        payload.descriptionImages = await ImageService.uploadMultiple(
          files.descriptionImages,
          CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY
        )
      }

      const [booking] = await BookingModel.create([{ ...payload, doctorID: schedule.doctorID, date: schedule.date }], {
        session
      })

      return booking
    })
  },

  updateBookingService: async (userId: string, _id: string, payload: UpdateBookingBody, files?: BookingFiles) => {
    const session = await mongoose.startSession()

    return session.withTransaction(async () => {
      const booking = await BookingModel.findById(_id).session(session)
      if (!booking) throw new BadRequestError('Booking không tồn tại')

      await validateUserManagePatient(booking.patientID.toString(), userId)

      const newTimeSlot = payload.timeSlot ?? booking.timeSlot
      const isSlotChanged = newTimeSlot !== booking.timeSlot

      if (isSlotChanged) {
        const duplicate = await BookingModel.exists({
          _id: { $ne: _id },
          patientID: booking.patientID,
          date: booking.date,
          timeSlot: newTimeSlot,
          status: { $ne: BookingStatus.CANCELLED }
        }).session(session)

        if (duplicate) throw new BadRequestError('Bạn đã có lịch khám cùng ngày và khung giờ này')

        await ScheduleModel.updateOne(
          {
            _id: booking.scheduleID,
            'timeSlots.time': booking.timeSlot
          },
          { $inc: { 'timeSlots.$.bookedCount': -1 } },
          { session }
        )

        const updated = await ScheduleModel.findOneAndUpdate(
          {
            _id: booking.scheduleID,
            timeSlots: {
              $elemMatch: {
                time: newTimeSlot,
                $expr: { $lt: ['$bookedCount', '$maxNumber'] }
              }
            }
          },
          { $inc: { 'timeSlots.$.bookedCount': 1 } },
          { session }
        )

        if (!updated) throw new BadRequestError('Khung giờ này đã đầy')

        booking.timeSlot = newTimeSlot
      }

      if (payload.description) booking.description = payload.description

      if (files?.descriptionImages) {
        booking.descriptionImages = await ImageService.uploadMultiple(
          files.descriptionImages,
          CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY
        )
      }

      await booking.save({ session })

      return booking
    })
  },

  cancelBookingByUserService: async (userId: string, _id: string) => {
    const session = await mongoose.startSession()

    return session.withTransaction(async () => {
      const booking = await BookingModel.findById(_id).session(session)

      if (!booking) throw new NotFoundError('Lịch đặt không tồn tại')

      await validateUserManagePatient(booking.patientID.toString(), userId)

      if (booking.status === BookingStatus.CANCELLED) throw new BadRequestError('Lịch đã được huỷ trước đó')

      if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.EXAMINED)
        throw new BadRequestError('Không thể huỷ lịch đã xác nhận hoặc hoàn thành')

      await BookingService.decreaseBookedCount(booking.scheduleID.toString(), booking.timeSlot, session)

      booking.status = BookingStatus.CANCELLED
      booking.deletedAt = new Date()

      await booking.save({ session })

      return booking
    })
  },

  decreaseBookedCount: async (scheduleID: string, timeSlot: string, session: ClientSession) => {
    const result = await ScheduleModel.updateOne(
      {
        _id: scheduleID,
        timeSlots: {
          $elemMatch: {
            time: timeSlot,
            bookedCount: { $gt: 0 }
          }
        }
      },
      { $inc: { 'timeSlots.$.bookedCount': -1 } },
      { session }
    )

    if (!result.modifiedCount) throw new BadRequestError('Slot không hợp lệ')
  }
}

export default BookingService
