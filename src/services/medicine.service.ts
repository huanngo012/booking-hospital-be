import { NotFoundError } from '~/core/error.response'
import { MedicineModel } from '~/models/Medicine'
import { Medicine, MedicineBody, MedicineQueryParams } from '~/types/medicine.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import {
  validateHostHasMedicalFacility,
  validateSpecialtyBelongsToFacility
} from '~/validations/medical_facility.validation'
import { validateSpecialty } from '~/validations/specialty.validation'

const MedicineService = {
  getMedicinesService: async (userId: string, queries: MedicineQueryParams) => {
    const { limit, sort, page, fields, ...filter } = queries
    const medicalFacilityID = await validateHostHasMedicalFacility(userId)
    const pipeline = buildAggregateQuery({
      filter: {
        deletedAt: null,
        ...(userId && { medicalFacilityID }),
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

  getMedicineByIdService: async (userId: string, _id: string) => {
    const medicalFacilityID = await validateHostHasMedicalFacility(userId)
    const response = await MedicineModel.findOne({ _id, medicalFacilityID })
    if (!response) {
      throw new NotFoundError('Thuốc không tồn tại')
    }
    return response
  },

  createMedicineService: async (userId: string, payload: MedicineBody) => {
    const medicalFacilityID = await validateHostHasMedicalFacility(userId)
    await validateSpecialty(payload.specialtyID)
    await validateSpecialtyBelongsToFacility(medicalFacilityID.toString(), payload.specialtyID)
    const response = await MedicineModel.create({ ...payload, medicalFacilityID })
    return response
  },

  updateMedicineService: async (userId: string, _id: string, payload: Partial<MedicineBody>) => {
    const medicalFacilityID = await validateHostHasMedicalFacility(userId)
    const response = await MedicineModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Thuốc không tồn tại')
    }
    if (payload.specialtyID) {
      await validateSpecialty(payload.specialtyID)
      await validateSpecialtyBelongsToFacility(medicalFacilityID.toString(), payload.specialtyID)
    }
    Object.assign(response, payload)
    await response.save()
    return response
  },

  deleteMedicineService: async (userId: string, _id: string) => {
    const medicalFacilityID = await validateHostHasMedicalFacility(userId)
    const response = await MedicineModel.findOneAndUpdate(
      { _id, medicalFacilityID },
      { deletedAt: new Date() },
      { new: true }
    )
    if (!response) {
      throw new NotFoundError('Thuốc không tồn tại')
    }
    return response
  }
}

export default MedicineService
