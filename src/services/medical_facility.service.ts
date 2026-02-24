import { MedicalFacilityModel } from '~/models/MedicalFacility'
import { MedicalFacilityBody, MedicalFacilityParams, MedicalFacilityQuery } from '~/schemas/medical_facility.schema'
import { extractPublicIdFromUrl, handleMongoDuplicateError, removeVietnameseTones } from '~/utils/helpers'
import ImageService from './image.service'
import { CloudinaryFolder } from '~/constants/enums'
import { NotFoundError } from '~/core/error.response'
import { validateCategory, validateHost, validateSpecialties } from '~/validations/medical_facility.validation'
import { MedicalFacilityFiles } from '~/types/medical-facility.type'

const MedicalFacilityService = {
  getMedicalFacilitiesService: async (queries: MedicalFacilityQuery) => {
    const { limit, sort, page, fields, name, ...filter } = queries
    let filterQuery: Record<string, unknown> = { ...filter }
    if (name) {
      filterQuery = {
        ...filterQuery,
        nameNormalized: {
          $regex: `${removeVietnameseTones(name)}`
        }
      }
    }
    let queryCommand = MedicalFacilityModel.find(filterQuery)
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
  },

  getMedicalFacilityService: async (_id: MedicalFacilityParams) => {
    const response = await MedicalFacilityModel.findById(_id)
    if (!response) {
      throw new NotFoundError('Cơ sở y tế không tồn tại')
    }
    return response
  },

  createMedicalFacilityService: async (payload: MedicalFacilityBody, files?: MedicalFacilityFiles) => {
    try {
      const { hostID, categoryID, specialtyID } = payload

      await validateHost(hostID)
      await validateCategory(categoryID)
      await validateSpecialties(specialtyID)

      if (files?.logo?.[0]) {
        const url = await ImageService.uploadSingle(files.logo[0], CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY)
        payload.logo = url
      }
      if (files?.images) {
        const urls = await ImageService.uploadMultiple(files.images, CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY)
        payload.images = urls
      }

      const response = await MedicalFacilityModel.create(payload)
      return response
    } catch (error: unknown) {
      return handleMongoDuplicateError(error, 'Cơ sở y tế đã tồn tại')
    }
  },

  updateMedicalFacilityService: async (
    _id: MedicalFacilityParams,
    payload: MedicalFacilityBody,
    files?: MedicalFacilityFiles
  ) => {
    try {
      const { hostID, categoryID, specialtyID, removeImageUrls } = payload || {}

      const facility = await MedicalFacilityModel.findById(_id)
      if (!facility) throw new NotFoundError('Cơ sở y tế không tồn tại')

      if (hostID && hostID !== facility.hostID.toString()) await validateHost(hostID, _id._id)

      if (categoryID) await validateCategory(categoryID)

      if (specialtyID) await validateSpecialties(specialtyID)
      if (files?.logo?.[0]) {
        const url = await ImageService.uploadSingle(files.logo[0], CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY)
        if (facility.logo) await ImageService.deleteByPublicId(extractPublicIdFromUrl(facility.logo))
        payload.logo = url
      }

      if (removeImageUrls?.length) {
        const removeImageIds = removeImageUrls.map((item) => extractPublicIdFromUrl(item))
        await ImageService.deleteMultiple(removeImageIds)
        facility.images = facility.images.filter((item) => !removeImageUrls.includes(item))
      }
      console.log('huanha', files?.images)

      if (files?.images?.length) {
        const urls = await ImageService.uploadMultiple(files.images, CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY)
        facility.images.concat(urls)
      }

      Object.assign(facility, payload)
      return await facility.save()
    } catch (error: unknown) {
      return handleMongoDuplicateError(error, 'Cơ sở y tế đã tồn tại')
    }
  },

  deleteMedicalFacilityService: async (_id: MedicalFacilityParams) => {
    const response = await MedicalFacilityModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (!response) {
      throw new NotFoundError('Cơ sở y tế không tồn tại')
    }
    return response
  }
}

export default MedicalFacilityService
