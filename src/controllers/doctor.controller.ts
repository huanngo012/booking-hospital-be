import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CREATED, DELETED, OK } from '~/core/success.response'
import DoctorService from '~/services/doctor.service'

const DoctorController = {
  getDoctors: asyncHandler(async (req: Request, res: Response) => {
    const response = await DoctorService.getDoctorsService(req.query)
    new OK({ data: response }).send(res)
  }),

  getDoctor: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await DoctorService.getDoctorService(_id)
    new OK({ data: response }).send(res)
  }),

  createDoctor: asyncHandler(async (req: Request, res: Response) => {
    const response = await DoctorService.createDoctorService(req.body)
    new CREATED({ data: response }).send(res)
  }),

  updateDoctor: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await DoctorService.updateDoctorService(_id, req.body)
    new OK({ data: response }).send(res)
  }),

  deleteDoctor: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    await DoctorService.deleteDoctorService(_id)
    new DELETED().send(res)
  })
}

export default DoctorController
