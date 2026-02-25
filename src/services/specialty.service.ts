import { NotFoundError } from '~/core/error.response'
import { SpecialtyModel } from '~/models/Specialty'
import { Specialty, SpecialtyBody, SpecialtyQueryParams } from '~/types/specialty.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { removeVietnameseTones } from '~/utils/helpers'

const SpecialtyService = {
  getSpecialiesService: async (queries: SpecialtyQueryParams) => {
    const { limit, sort, page, fields, name, ...filter } = queries

    const pipeline = buildAggregateQuery({
      filter: {
        deletedAt: null,
        ...filter
      },
      search: {
        ...(name && { nameNormalized: removeVietnameseTones(name) })
      },
      sort,
      fields,
      page,
      limit
    })

    const response = await SpecialtyModel.aggregate(pipeline)
    return formatAggregateResult<Specialty>(response, page, limit)
  },

  getSpecialtyBySlugService: async (slug: string) => {
    const response = await SpecialtyModel.findOne({ slug })
    if (!response) {
      throw new NotFoundError('Chuyên khoa không tồn tại')
    }
    return response
  },

  createSpecialtyService: async (payload: SpecialtyBody) => {
    const response = await SpecialtyModel.create(payload)
    return response
  },

  updateSpecialtyService: async (_id: string, payload: Partial<SpecialtyBody>) => {
    const response = await SpecialtyModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Chuyên khoa không tồn tại')
    }
    Object.assign(response, payload)
    await response.save()
    return response
  },

  deleteSpecialtyService: async (_id: string) => {
    const response = await SpecialtyModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw new NotFoundError('Chuyên khoa không tồn tại')
    }
    return response
  }
}

export default SpecialtyService
