import { NotFoundError } from '~/core/error.response'
import { DoctorModel } from '~/models/Doctor'
import { DoctorQuery } from '~/schemas/doctor.schema'
import { Doctor } from '~/types/doctor.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { removeVietnameseTones } from '~/utils/helpers'
import { validateDoctorProfileExists } from '~/validations/doctor.validation'
import { validateMedicalFacility, validateSpecialty } from '~/validations/medical_facility.validation'
import { validateDoctor } from '~/validations/user.validation'

const DoctorService = {
  getDoctorsService: async (queries: DoctorQuery) => {
    try {
      const { limit, sort, page, fields, name, ...filter } = queries

      const pipeline = buildAggregateQuery({
        filter: {
          deletedAt: null,
          ...filter
        },
        lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        },
        search: name
          ? {
              keyword: removeVietnameseTones(name),
              field: 'user.nameNormalized'
            }
          : undefined,
        sort,
        fields,
        page,
        limit
      })
      const response = await DoctorModel.aggregate(pipeline)

      return formatAggregateResult<Doctor & { user: unknown }>(response, Number(page), Number(limit))
    } catch (err) {
      console.log(err)
    }
  },

  getDoctorService: async (_id: string) => {
    const response = await DoctorModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Hồ sơ bác sĩ không tồn tại')
    }
    return response
  },

  createDoctorService: async (payload: Doctor) => {
    await validateDoctor(payload.userID.toString())
    await validateDoctorProfileExists(payload.userID.toString())
    await validateMedicalFacility(payload.medicalFacilityID.toString())
    await validateSpecialty(payload.specialtyID.toString())
    const response = await DoctorModel.create(payload)
    return response
  },

  updateDoctorService: async (_id: string, payload: Partial<Doctor>) => {
    const response = await DoctorModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Hồ sơ bác sĩ không tồn tại')
    }

    if (payload._id) {
      await validateDoctor(payload._id.toString())
      await validateDoctorProfileExists(payload._id.toString())
    }
    if (payload.medicalFacilityID) await validateMedicalFacility(payload.medicalFacilityID.toString())
    if (payload.specialtyID) await validateSpecialty(payload.specialtyID.toString())

    Object.assign(response, payload)
    await response.save()
    return response
  },

  deleteDoctorService: async (_id: string) => {
    const response = await DoctorModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw new NotFoundError('Hồ sơ bác sĩ không tồn tại')
    }
    return response
  }
}

export default DoctorService
