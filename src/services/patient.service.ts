import { Types } from 'mongoose'
import { NotFoundError } from '~/core/error.response'
import { PatientModel } from '~/models/Patient'
import { Patient, PatientBody, PatientQueryParams } from '~/types/patient.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { removeVietnameseTones } from '~/utils/helpers'

const PatientService = {
  getPatientsService: async (userId: string, queries: PatientQueryParams) => {
    const { limit, sort, page, fields, name, ...filter } = queries

    const pipeline = buildAggregateQuery({
      filter: {
        deletedAt: null,
        ...filter,
        ...(userId && { bookedBy: new Types.ObjectId(userId) })
      },
      search: {
        ...(name && { nameNormalized: removeVietnameseTones(name) })
      },
      sort,
      fields,
      page,
      limit
    })

    const response = await PatientModel.aggregate(pipeline)
    return formatAggregateResult<Patient>(response, page, limit)
  },

  getPatientByIdService: async (userId: string, _id: string) => {
    const response = await PatientModel.findOne({
      _id,
      bookedBy: userId
    })
    if (!response) {
      throw new NotFoundError('Hồ sơ bệnh nhân không tồn tại')
    }
    return response
  },

  createPatientService: async (userId: string, payload: PatientBody) => {
    const response = await PatientModel.create({ ...payload, bookedBy: userId })
    return response
  },

  updatePatientService: async (userId: string, _id: string, payload: Partial<PatientBody>) => {
    const response = await PatientModel.findOne({
      _id,
      bookedBy: userId
    })
    if (!response) {
      throw new NotFoundError('Hồ sơ bệnh nhân không tồn tại')
    }
    Object.assign(response, payload)
    await response.save()
    return response
  },

  deletePatientService: async (userId: string, _id: string) => {
    const response = await PatientModel.findOneAndUpdate(
      { _id, bookedBy: userId },
      { deletedAt: new Date() },
      { new: true }
    )
    if (!response) {
      throw new NotFoundError('Hồ sơ bệnh nhân không tồn tại')
    }
    return response
  }
}

export default PatientService
