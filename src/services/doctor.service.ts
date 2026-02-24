import { NotFoundError } from '~/core/error.response'
import { DoctorModel } from '~/models/Doctor'
import { DoctorQuery } from '~/schemas/doctor.schema'
import { Doctor } from '~/types/doctor.type'
import { removeVietnameseTones } from '~/utils/helpers'
import { validateDoctorProfileExists } from '~/validations/doctor.validation'
import { validateMedicalFacility, validateSpecialty } from '~/validations/medical_facility.validation'
import { validateDoctor } from '~/validations/user.validation'

const DoctorService = {
  getDoctorsService: async (queries: DoctorQuery) => {
    try {
      const { limit, sort, page, fields, name, ...filter } = queries
      let filterQuery: Record<string, unknown> = { ...filter }
      if (name) {
        filterQuery = {
          ...filterQuery,
          '_id.nameNormalized': {
            $regex: `${removeVietnameseTones(name)}`
          }
        }
      }
      let queryCommand = DoctorModel.find(filterQuery).populate({
        path: '_id'
      })
      if (sort) {
        queryCommand = queryCommand.sort(sort.split(',').join(' '))
      }
      if (fields) {
        queryCommand = queryCommand.select(fields.split(',').join(' '))
      }
      const pageNumber = Math.max(1, Number(page) || 1)
      const limitNumber = Math.max(1, Number(limit) || Number(process.env.LIMIT) || 10)
      const skip = (pageNumber - 1) * limitNumber
      queryCommand = queryCommand.skip(skip).limit(limitNumber)

      const response = await queryCommand.exec()
      return response
    } catch (error) {
      console.log('ERROR:', error)
      throw error
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
    await validateDoctor(payload._id.toString())
    await validateDoctorProfileExists(payload._id.toString())
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
