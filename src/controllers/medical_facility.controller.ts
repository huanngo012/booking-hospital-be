import asyncHandler from 'express-async-handler'
import { Response } from 'express'
import { CREATED } from '~/core/success.response'
import { MedicalFacilityBody } from '~/schemas/medical_facility.schema'
import MedicalFacilityService from '~/services/medical_facility.service'
import { MedicalFacility } from '~/types/medical-facility.type'

const MedicalFacilityController = {
  createMedicalFacility: asyncHandler(async (req: BodyRequest<MedicalFacilityBody>, res: Response) => {
    const response = await MedicalFacilityService.createMedicalFacilityService(req.body)
    new CREATED<MedicalFacility>({ data: response }).send(res)
  })
}

export default MedicalFacilityController
