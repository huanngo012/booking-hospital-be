import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import MedicineService from '~/services/medicine.service'

const MedicineController = {
  getMedicines: asyncHandler(async (req: Request, res: Response) => {
    const { data, pagination } = await MedicineService.getMedicinesService(req.query)
    new OK({ data, pagination }).send(res)
  }),

  getMedicineById: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await MedicineService.getMedicineByIdService(_id)
    new OK({ data: response }).send(res)
  }),

  createMedicine: asyncHandler(async (req: Request, res: Response) => {
    const response = await MedicineService.createMedicineService(req.body)
    new CREATED({ data: response }).send(res)
  }),

  updateMedicine: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await MedicineService.updateMedicineService(_id, req.body)
    new OK({ data: response }).send(res)
  }),

  deleteMedicine: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    await MedicineService.deleteMedicineService(_id)
    new DELETED().send(res)
  })
}

export default MedicineController
