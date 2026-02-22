import { MedicalFacilityModel } from '~/models/MedicalFacility'
import { MedicalFacilityBody } from '~/schemas/medical_facility.schema'
import { handleMongoDuplicateError } from '~/utils/helpers'

const MedicalFacilityService = {
  createMedicalFacilityService: async (payload: MedicalFacilityBody) => {
    try {
      const response = await MedicalFacilityModel.create(payload)
      return response
    } catch (error: unknown) {
      return handleMongoDuplicateError(error, 'Danh mục đã tồn tại')
    }
  }
}

export default MedicalFacilityService
