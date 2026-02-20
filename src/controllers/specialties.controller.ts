import asyncHandler from 'express-async-handler'
import { Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import SpecialtyService from '~/services/specialties.service'
import { SpecialtyBody, SpecialtyParams, SpecialtyQuery } from '~/schemas/specialty.schema'
import { Specialty } from '~/types/specialty.type'

const SpecialtyController = {
  getSpecialties: asyncHandler(async (req: QueryRequest<SpecialtyQuery>, res: Response) => {
    const response = await SpecialtyService.getSpecialiesService(req.query)
    new OK<Specialty[]>({ data: response }).send(res)
  }),

  getSpecialty: asyncHandler(async (req: ParamsRequest<SpecialtyParams>, res: Response) => {
    const response = await SpecialtyService.getSpecialtyService(req.params)
    new OK<Specialty>({ data: response }).send(res)
  }),

  createSpecialty: asyncHandler(async (req: BodyRequest<SpecialtyBody>, res: Response) => {
    const response = await SpecialtyService.createSpecialtyService(req.body)
    new CREATED<Specialty>({ data: response }).send(res)
  }),

  updateSpecialty: asyncHandler(async (req: ParamsBodyRequest<SpecialtyParams, SpecialtyBody>, res: Response) => {
    const response = await SpecialtyService.updateSpecialtyService(req.params, req.body)
    new OK<Specialty>({ data: response }).send(res)
  }),

  deleteSpecialty: asyncHandler(async (req: ParamsRequest<SpecialtyParams>, res: Response) => {
    await SpecialtyService.deleteSpecialtyService(req.params)
    new DELETED().send(res)
  })
}

export default SpecialtyController
