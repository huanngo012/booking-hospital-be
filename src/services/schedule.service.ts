import { NotFoundError } from '~/core/error.response'
import { ScheduleModel } from '~/models/Schedule'
import { Schedule, ScheduleBody, ScheduleQueryParams } from '~/types/schedule.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'

const ScheduleService = {
  getSchedulesService: async (queries: ScheduleQueryParams) => {
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

  createScheduleService: async (payload: ScheduleBody) => {
    const response = await ScheduleModel.create(payload)
    return response
  },

  updateScheduleService: async (_id: string, payload: Partial<ScheduleBody>) => {
    const response = await ScheduleModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Lịch khám không tồn tại')
    }
    Object.assign(response, payload)
    await response.save()
    return response
  },

  deleteScheduleService: async (_id: string) => {
    const response = await ScheduleModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw new NotFoundError('Lịch khám không tồn tại')
    }
    return response
  }
}

export default ScheduleService
