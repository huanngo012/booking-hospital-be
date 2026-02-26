import { NotFoundError } from '~/core/error.response'
import { MedicineModel } from '~/models/Medicine'
import { Medicine, MedicineBody, MedicineQueryParams } from '~/types/medicine.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'

const MedicineService = {
  getMedicinesService: async (queries: MedicineQueryParams) => {
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

    const response = await MedicineModel.aggregate(pipeline)
    return formatAggregateResult<Medicine>(response, page, limit)
  },

  getMedicineByIdService: async (_id: string) => {
    const response = await MedicineModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Thuốc không tồn tại')
    }
    return response
  },

  createMedicineService: async (payload: MedicineBody) => {
    const response = await MedicineModel.create(payload)
    return response
  },

  updateMedicineService: async (_id: string, payload: Partial<MedicineBody>) => {
    const response = await MedicineModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Thuốc không tồn tại')
    }
    Object.assign(response, payload)
    await response.save()
    return response
  },

  deleteMedicineService: async (_id: string) => {
    const response = await MedicineModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw new NotFoundError('Thuốc không tồn tại')
    }
    return response
  }
}

export default MedicineService
