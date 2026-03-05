import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import SpecialtyService from '~/services/specialty.service'

const SpecialtyController = {
  getSpecialties: asyncHandler(async (req: Request, res: Response) => {
    const { data, pagination } = await SpecialtyService.getSpecialiesService(req.query)
    new OK({
      data: {
        items: data,
        pagination
      }
    }).send(res)
  }),

  getSpecialtyBySlug: asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string
    const response = await SpecialtyService.getSpecialtyBySlugService(slug)
    new OK({ data: response }).send(res)
  }),

  createSpecialty: asyncHandler(async (req: Request, res: Response) => {
    const response = await SpecialtyService.createSpecialtyService(req.body)
    new CREATED({ data: response }).send(res)
  }),

  updateSpecialty: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await SpecialtyService.updateSpecialtyService(_id, req.body)
    new OK({ data: response }).send(res)
  }),

  deleteSpecialty: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    await SpecialtyService.deleteSpecialtyService(_id)
    new DELETED().send(res)
  })
}

export default SpecialtyController
