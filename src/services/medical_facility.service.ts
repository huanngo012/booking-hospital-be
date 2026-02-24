import { MedicalFacilityModel } from '~/models/MedicalFacility'
import { MedicalFacilityBody } from '~/schemas/medical_facility.schema'
import { handleMongoDuplicateError } from '~/utils/helpers'
import ImageService from './image.service'
import { CloudinaryFolder } from '~/constants/enums'

const MedicalFacilityService = {
  createMedicalFacilityService: async (
    payload: MedicalFacilityBody,
    files?: {
      logo?: Express.Multer.File[]
      images?: Express.Multer.File[]
    }
  ) => {
    try {
      if (files?.logo?.[0]) {
        const result = await ImageService.uploadSingle(files.logo[0], CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY)
        console.log(result)
      }
      if (files?.images) {
        const result = await ImageService.uploadMultiple(files.images, CloudinaryFolder.BOOKINGS_MEDICAL_FACILITY)
        console.log(result)
      }

      const response = await MedicalFacilityModel.create(payload)
      return response
    } catch (error: unknown) {
      return handleMongoDuplicateError(error, 'Danh mục đã tồn tại')
    }
  }
}

export default MedicalFacilityService
