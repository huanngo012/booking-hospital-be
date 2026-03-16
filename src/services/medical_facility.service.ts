import { MedicalFacilityModel } from '~/models/MedicalFacility'
import { extractPublicIdFromUrl, removeVietnameseTones } from '~/utils/helpers'
import ImageService from './image.service'
import { CloudinaryFolder, RoleCode } from '~/constants/enums'
import { NotFoundError } from '~/core/error.response'
import {
  MedicalFacility,
  MedicalFacilityBody,
  MedicalFacilityFiles,
  MedicalFacilityQueryParams,
  MedicalFacilityRatingBody
} from '~/types/medical-facility.type'
import { buildAggregateQuery, formatAggregateResult } from '~/utils/buildAggregateQuery'
import { validateUserRole } from '~/validations/user.validation'
import { validateCategory } from '~/validations/category.validation'
import { validateSpecialties } from '~/validations/specialty.validation'
import { validateHostFacilityOwnership } from '~/validations/medical_facility.validation'
import { Types } from 'mongoose'

const MedicalFacilityService = {
  getMedicalFacilitiesService: async (queries: MedicalFacilityQueryParams) => {
    const { limit, sort, page, fields, name, categoryID, specialtyID, province, ...filter } = queries

    const pipeline = buildAggregateQuery({
      filter: {
        deletedAt: null,
        ...(categoryID && { categoryID: new Types.ObjectId(categoryID) }),
        ...(specialtyID && { specialtyID: new Types.ObjectId(specialtyID) }),
        ...(province && { 'address.province': province }),
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

    const response = await MedicalFacilityModel.aggregate(pipeline)
    return formatAggregateResult<MedicalFacility>(response, page, limit)
  },

  getMedicalFacilityBySlugService: async (slug: string) => {
    const response = await MedicalFacilityModel.findOne({ slug }).populate('specialtyID')
    if (!response) {
      throw new NotFoundError('Cơ sở y tế không tồn tại')
    }
    return response
  },

  createMedicalFacilityService: async (payload: MedicalFacilityBody, files?: MedicalFacilityFiles) => {
    const { hostID, categoryID, specialtyID } = payload

    await validateUserRole(hostID, RoleCode.HOST)
    await validateHostFacilityOwnership(hostID)
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
  },

  updateMedicalFacilityService: async (
    _id: string,
    payload: Partial<MedicalFacilityBody>,
    files?: MedicalFacilityFiles
  ) => {
    const { hostID, categoryID, specialtyID, removeImageUrls } = payload || {}

    const facility = await MedicalFacilityModel.findById(_id)
    if (!facility) throw new NotFoundError('Cơ sở y tế không tồn tại')

    if (hostID && hostID !== facility.hostID.toString()) await validateHostFacilityOwnership(hostID, _id)

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

    if (files?.images?.length) {
      const urls = await ImageService.uploadMultiple(files.images, CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY)
      facility.images.push(...urls)
    }

    Object.assign(facility, payload)
    return await facility.save()
  },

  deleteMedicalFacilityService: async (_id: string) => {
    const response = await MedicalFacilityModel.findOneAndUpdate({ _id }, { deletedAt: new Date() }, { new: true })
    if (response) {
      const removeImageIds = [...(response.images ?? []), response.logo].map((item) => extractPublicIdFromUrl(item))
      await ImageService.deleteMultiple(removeImageIds)
    }
    if (!response) {
      throw new NotFoundError('Cơ sở y tế không tồn tại')
    }
    return response
  },

  ratingsClinic: async (userId: string, _id: string, payload: MedicalFacilityRatingBody) => {
    const { star, comment } = payload

    const facility = await MedicalFacilityModel.findById(_id)
    if (!facility) throw new NotFoundError('Cơ sở y tế không tồn tại')

    const alreadyRated = facility.ratings.find((item) => item.postedBy.toString() === userId)

    if (alreadyRated) {
      alreadyRated.star = Number(star)
      alreadyRated.comment = comment
    } else {
      facility.ratings.push({
        star: Number(star),
        comment,
        postedBy: new Types.ObjectId(userId)
      })
    }

    const ratingCount = facility.ratings.length
    const sum = facility.ratings.reduce((acc, item) => acc + item.star, 0)
    facility.totalRatings = Math.round((sum / ratingCount) * 10) / 10

    const response = await facility.save()
    return response
  },

  deleteRating: async (userId: string, _id: string) => {
    const facility = await MedicalFacilityModel.findById(_id)
    if (!facility) throw new NotFoundError('Cơ sở y tế không tồn tại')

    facility.ratings = facility.ratings.filter((item) => item.postedBy.toString() !== userId)

    const ratingCount = facility.ratings.length
    const sum = facility.ratings.reduce((acc, item) => acc + item.star, 0)
    facility.totalRatings = ratingCount ? Math.round((sum / ratingCount) * 10) / 10 : 0

    const response = await facility.save()
    return response
  }
}

export default MedicalFacilityService
