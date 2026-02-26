import { NotFoundError } from '~/core/error.response'
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

  createRecordService: async (payload: RecordBody) => {
    const response = await RecordModel.create(payload)
    return response
  },

  updateRecordService: async (_id: string, payload: Partial<RecordBody>) => {
    const response = await RecordModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Hồ sơ khám bệnh không tồn tại')
    }
    Object.assign(response, payload)
    await response.save()
    return response
  },

  deleteRecordService: async (_id: string) => {
    const response = await RecordModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw new NotFoundError('Hồ sơ khám bệnh không tồn tại')
    }
    return response
  }
}

export default RecordService
