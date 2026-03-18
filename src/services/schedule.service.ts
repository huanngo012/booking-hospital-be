import dayjs from 'dayjs'
import { Types } from 'mongoose'
import { BadRequestError, NotFoundError } from '~/core/error.response'
import { ScheduleModel } from '~/models/Schedule'
import { Schedule, ScheduleBody, ScheduleQueryParams } from '~/types/schedule.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { normalizeDate } from '~/utils/helpers'
import { validateHostManageDoctor } from '~/validations/medical_facility.validation'
import { validateDuplicateTime } from '~/validations/schedule.validation'

const ScheduleService = {
  getSchedulesService: async (queries: ScheduleQueryParams) => {
    const { limit, sort, page, fields, doctorID, ...filter } = queries

    const pipeline = buildAggregateQuery({
      filter: {
        deletedAt: null,
        ...(doctorID && { doctorID: new Types.ObjectId(doctorID) }),
        ...filter
      },
      sort,
      fields,
      page,
      limit
    })

    const response = await ScheduleModel.aggregate(pipeline)
    return formatAggregateResult<Schedule>(response, page, limit)
  },

  getScheduleByIdService: async (_id: string) => {
    const response = await ScheduleModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Lịch khám không tồn tại')
    }
    return response
  },

  createScheduleService: async (hostId: string, payload: ScheduleBody) => {
    await validateHostManageDoctor(payload.doctorID, hostId)
    validateDuplicateTime(payload.timeSlots)

    const normalizedDate = normalizeDate(payload.date.toString())

    const response = await ScheduleModel.create({ ...payload, date: normalizedDate })
    return response
  },

  updateScheduleService: async (hostId: string, _id: string, payload: Partial<ScheduleBody>) => {
    const schedule = await ScheduleModel.findById(_id)
    if (!schedule) {
      throw new NotFoundError('Lịch khám không tồn tại')
    }
    await validateHostManageDoctor(schedule.doctorID.toString(), hostId)

    if (payload.doctorID || payload.date) {
      throw new BadRequestError('Không được phép thay đổi bác sĩ hoặc ngày')
    }

    if (payload.timeSlots) {
      validateDuplicateTime(payload.timeSlots)

      const incomingIds = payload.timeSlots.filter((s) => s._id).map((s) => s._id!.toString())

      for (const existingSlot of schedule.timeSlots) {
        const stillExists = incomingIds.includes(existingSlot._id.toString())

        if (!stillExists) {
          if (existingSlot.bookedCount > 0) {
            throw new BadRequestError(`Không thể xoá slot ${existingSlot.time}`)
          }

          schedule.timeSlots.pull(existingSlot._id)
        }
      }
      for (const newSlot of payload.timeSlots) {
        if (newSlot._id) {
          const existingSlot = schedule.timeSlots.id(newSlot._id)

          if (!existingSlot) {
            throw new BadRequestError('Slot không tồn tại')
          }

          if (existingSlot.bookedCount > 0 && newSlot.time !== existingSlot.time) {
            throw new BadRequestError(`Không thể đổi giờ slot ${existingSlot.time} vì đã có người đặt`)
          }

          if (newSlot.maxNumber < existingSlot.bookedCount) {
            throw new BadRequestError(`Slot ${existingSlot.time} đã có ${existingSlot.bookedCount} người đặt`)
          }

          const isDuplicateInDB = schedule.timeSlots.some(
            (slot) => slot._id.toString() !== existingSlot._id.toString() && slot.time === newSlot.time
          )

          if (isDuplicateInDB) {
            throw new BadRequestError(`Giờ ${newSlot.time} đã tồn tại`)
          }

          existingSlot.time = newSlot.time
          existingSlot.maxNumber = newSlot.maxNumber
        } else {
          const isDuplicate = schedule.timeSlots.some((slot) => slot.time === newSlot.time)

          if (isDuplicate) {
            throw new BadRequestError(`Giờ ${newSlot.time} đã tồn tại`)
          }

          schedule.timeSlots.push({
            time: newSlot.time,
            maxNumber: newSlot.maxNumber,
            bookedCount: 0
          })
        }
      }
    }

    await schedule.save()
    return schedule
  },

  deleteScheduleService: async (_id: string) => {
    const response = await ScheduleModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw new NotFoundError('Lịch khám không tồn tại')
    }
    return response
  },

  getAvailableDatesByMonthService: async (queries: ScheduleQueryParams) => {
    const { doctorID, month } = queries

    const startOfMonth = dayjs(month).tz('Asia/Ho_Chi_Minh').startOf('month').toDate()

    const endOfMonth = dayjs(month).tz('Asia/Ho_Chi_Minh').endOf('month').toDate()

    const schedules = await ScheduleModel.aggregate([
      {
        $match: {
          doctorID: new Types.ObjectId(doctorID),
          deletedAt: null,
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ])

    return schedules.map((item) => dayjs(item.date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD'))
  }
}

export default ScheduleService
