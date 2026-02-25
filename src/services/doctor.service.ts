import { Types } from 'mongoose'
import slugify from 'slugify'
import { RoleCode } from '~/constants/enums'
import { NotFoundError } from '~/core/error.response'
import { DoctorModel } from '~/models/Doctor'
import { Doctor, DoctorBody, DoctorQueryParams } from '~/types/doctor.type'
import { User } from '~/types/user.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { removeVietnameseTones } from '~/utils/helpers'
import { validateDoctorProfileExists, validateDoctorSlugExists } from '~/validations/doctor.validation'
import { validateMedicalFacility } from '~/validations/medical_facility.validation'
import { validateSpecialty } from '~/validations/specialty.validation'
import { validateUserRole } from '~/validations/user.validation'

const DoctorService = {
  getDoctorsService: async (queries: DoctorQueryParams) => {
    const { limit, sort, page, fields, name, medicalFacilityID, specialtyID, ...filter } = queries

    const pipeline = buildAggregateQuery({
      filter: {
        deletedAt: null,
        ...(medicalFacilityID && { medicalFacilityID: new Types.ObjectId(medicalFacilityID) }),
        ...(specialtyID && { specialtyID: new Types.ObjectId(specialtyID) }),
        ...filter
      },
      lookup: [
        {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'user',
          unwind: true
        }
      ],
      search: {
        ...(name && { 'user.nameNormalized': removeVietnameseTones(name) })
      },
      sort,
      fields,
      page,
      limit
    })

    const response = await DoctorModel.aggregate(pipeline)

    return formatAggregateResult<Doctor & { user: User }>(response, page, limit)
  },

  getDoctorBySlugService: async (slug: string) => {
    const response = await DoctorModel.findOne({ slug })
    if (!response) {
      throw new NotFoundError('Hồ sơ bác sĩ không tồn tại')
    }
    return response
  },

  createDoctorService: async (payload: DoctorBody) => {
    await validateUserRole(payload.userID, RoleCode.DOCTOR)
    await validateDoctorProfileExists(payload.userID)
    await validateDoctorSlugExists(
      slugify(payload.slug, {
        lower: true,
        strict: true,
        locale: 'vi'
      })
    )
    await validateMedicalFacility(payload.medicalFacilityID)
    const response = await DoctorModel.create(payload)
    return response
  },

  updateDoctorService: async (_id: string, payload: Partial<DoctorBody>) => {
    const response = await DoctorModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Hồ sơ bác sĩ không tồn tại')
    }

    if (payload.userID) delete payload.userID
    if (payload.slug)
      await validateDoctorSlugExists(
        slugify(payload.slug, {
          lower: true,
          strict: true,
          locale: 'vi'
        }),
        _id
      )
    if (payload.medicalFacilityID) await validateMedicalFacility(payload.medicalFacilityID)
    if (payload.specialtyID) await validateSpecialty(payload.specialtyID)

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
