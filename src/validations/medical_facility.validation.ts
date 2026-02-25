import { BadRequestError } from '~/core/error.response'
import { MedicalFacilityModel } from '~/models/MedicalFacility'

const validateMedicalFacility = async (_id: string) => {
  const medicalFacilityExists = await MedicalFacilityModel.exists({ _id })
  if (!medicalFacilityExists) throw new BadRequestError('Cơ sở y tế không tồn tại')
}

const validateHostFacilityOwnership = async (hostID: string, currentFacilityId?: string) => {
  const existingFacility = await MedicalFacilityModel.exists({
    hostID,
    ...(currentFacilityId && {
      _id: { $ne: currentFacilityId }
    })
  })

  if (existingFacility) throw new BadRequestError('Host đã quản lý một cơ sở y tế khác')
}

export { validateHostFacilityOwnership, validateMedicalFacility }
