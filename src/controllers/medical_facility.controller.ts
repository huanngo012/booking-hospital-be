import asyncHandler from 'express-async-handler'
import { Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import { MedicalFacilityBody, MedicalFacilityParams, MedicalFacilityQuery } from '~/schemas/medical_facility.schema'
import MedicalFacilityService from '~/services/medical_facility.service'
import { MedicalFacility } from '~/types/medical-facility.type'

const MedicalFacilityController = {
  getMedicalFacilities: asyncHandler(async (req: QueryRequest<MedicalFacilityQuery>, res: Response) => {
    const response = await MedicalFacilityService.getMedicalFacilitiesService(req.query)
    new OK<MedicalFacility[]>({ data: response }).send(res)
  }),

  getMedicalFacility: asyncHandler(async (req: ParamsRequest<MedicalFacilityParams>, res: Response) => {
    const response = await MedicalFacilityService.getMedicalFacilityService(req.params)
    new OK<MedicalFacility>({ data: response }).send(res)
  }),

  createMedicalFacility: asyncHandler(async (req: BodyRequest<MedicalFacilityBody>, res: Response) => {
    const response = await MedicalFacilityService.createMedicalFacilityService(req.body, req.files)
    new CREATED<MedicalFacility>({ data: response }).send(res)
  }),

  updateMedicalFacility: asyncHandler(
    async (req: ParamsBodyRequest<MedicalFacilityParams, MedicalFacilityBody>, res: Response) => {
      const response = await MedicalFacilityService.updateMedicalFacilityService(req.params, req.body, req.files)
      new OK<MedicalFacility>({ data: response }).send(res)
    }
  ),

  deleteMedicalFacility: asyncHandler(async (req: ParamsRequest<MedicalFacilityParams>, res: Response) => {
    await MedicalFacilityService.deleteMedicalFacilityService(req.params)
    new DELETED().send(res)
  })
}

export default MedicalFacilityController
