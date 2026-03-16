import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import MedicalFacilityService from '~/services/medical_facility.service'

const MedicalFacilityController = {
  getMedicalFacilities: asyncHandler(async (req: Request, res: Response) => {
    const { data, pagination } = await MedicalFacilityService.getMedicalFacilitiesService(req.query)
    new OK({
      data: {
        items: data,
        pagination
      }
    }).send(res)
  }),

  getMedicalFacilityBySlug: asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string
    const response = await MedicalFacilityService.getMedicalFacilityBySlugService(slug)
    new OK({ data: response }).send(res)
  }),

  createMedicalFacility: asyncHandler(async (req: Request, res: Response) => {
    const response = await MedicalFacilityService.createMedicalFacilityService(req.body, req.files)
    new CREATED({ data: response }).send(res)
  }),

  updateMedicalFacility: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await MedicalFacilityService.updateMedicalFacilityService(_id, req.body, req.files)
    new OK({ data: response }).send(res)
  }),

  deleteMedicalFacility: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    await MedicalFacilityService.deleteMedicalFacilityService(_id)
    new DELETED().send(res)
  }),

  ratingsMedicalFacility: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const userId = req.user?._id.toString() as string
    await MedicalFacilityService.ratingsClinic(userId, _id, req.body)
    new DELETED().send(res)
  }),

  deleteRatingsMedicalFacility: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const userId = req.user?._id.toString() as string
    await MedicalFacilityService.deleteRating(userId, _id)
    new DELETED().send(res)
  })
}

export default MedicalFacilityController
