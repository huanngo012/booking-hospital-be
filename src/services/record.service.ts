import mongoose from 'mongoose'
import { BookingStatus } from '~/constants/enums'
import { BadRequestError, NotFoundError } from '~/core/error.response'
import { BookingModel } from '~/models/Booking'
import { RecordModel } from '~/models/Record'
import { Record, RecordBody, RecordQueryParams } from '~/types/record.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'

const RecordService = {
  getRecordsService: async (queries: RecordQueryParams) => {
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

    const response = await RecordModel.aggregate(pipeline)
    return formatAggregateResult<Record>(response, page, limit)
  },

  getRecordByIdService: async (_id: string) => {
    const response = await RecordModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Hồ sơ khám bệnh không tồn tại')
    }
    return response
  },

  createRecordService: async (doctorId: string, payload: RecordBody) => {
    const session = await mongoose.startSession()

    return session.withTransaction(async () => {
      const booking = await BookingModel.findById(payload.bookingID).session(session)

      if (!booking) throw new NotFoundError('Booking không tồn tại')

      if (booking.doctorID.toString() !== doctorId) throw new BadRequestError('Bạn không có quyền')

      if (booking.status !== BookingStatus.CONFIRMED) throw new BadRequestError('Chỉ được tạo hồ sơ khi đang khám')

      const existed = await RecordModel.exists({
        bookingID: payload.bookingID
      }).session(session)

      if (existed) throw new BadRequestError('Booking đã có hồ sơ')

      let totalPrice = 0
      if (payload.medicines) {
        for (const item of payload.medicines) {
          totalPrice += item.unitPrice * item.quantity
        }
      }

      const record = await RecordModel.create(
        [
          {
            ...payload,
            doctorID: doctorId,
            patientID: booking.patientID,
            totalPrice
          }
        ],
        { session }
      )

      booking.status = BookingStatus.EXAMINED
      await booking.save({ session })

      return record[0]
    })
  },

  updateRecordService: async (doctorId: string, _id: string, payload: Partial<RecordBody>) => {
    const session = await mongoose.startSession()

    return session.withTransaction(async () => {
      const record = await RecordModel.findById(_id).session(session)

      if (!record) throw new NotFoundError('Record không tồn tại')

      if (record.doctorID.toString() !== doctorId) throw new BadRequestError('Bạn không có quyền chỉnh sửa')

      if (payload.diagnosis !== undefined) record.diagnosis = payload.diagnosis

      if (payload.medicines) {
        let totalPrice = 0
        for (const item of payload.medicines) {
          totalPrice += item.unitPrice * item.quantity
        }

        record.medicines = payload.medicines
        record.totalPrice = totalPrice
      }

      await record.save({ session })

      return record
    })
  },

  deleteRecordService: async (doctorId: string, _id: string) => {
    const session = await mongoose.startSession()

    return session.withTransaction(async () => {
      const record = await RecordModel.findById(_id).session(session)

      if (!record) throw new NotFoundError('Hồ sơ khám bệnh không tồn tại')

      if (record.deletedAt) throw new BadRequestError('Hồ sơ đã bị xoá trước đó')

      if (record.doctorID.toString() !== doctorId) throw new BadRequestError('Bạn không có quyền xoá hồ sơ này')

      const booking = await BookingModel.findById(record.bookingID).session(session)

      if (booking && booking.status === BookingStatus.EXAMINED) {
        booking.status = BookingStatus.CONFIRMED
        await booking.save({ session })
      }

      record.deletedAt = new Date()
      await record.save({ session })

      return record
    })
  }
}

export default RecordService
