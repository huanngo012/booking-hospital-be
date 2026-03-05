import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { CREATED, DELETED, OK } from '~/core/success.response'
import PatientService from '~/services/patient.service'

const PatientController = {
  getPatients: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const { data, pagination } = await PatientService.getPatientsService(userId, req.query)
    new OK({
      data: {
        items: data,
        pagination
      }
    }).send(res)
  }),

  getPatientById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string
    const userId = req.user?._id.toString() as string
    const response = await PatientService.getPatientByIdService(userId, id)
    new OK({ data: response }).send(res)
  }),

  createPatient: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const response = await PatientService.createPatientService(userId, req.body)
    new CREATED({ data: response }).send(res)
  }),

  updatePatient: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const userId = req.user?._id.toString() as string
    const response = await PatientService.updatePatientService(userId, _id, req.body)
    new OK({ data: response }).send(res)
  }),

  deletePatient: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const userId = req.user?._id.toString() as string
    await PatientService.deletePatientService(userId, _id)
    new DELETED().send(res)
  })
}

export default PatientController
