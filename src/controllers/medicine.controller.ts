import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import MedicineService from '~/services/medicine.service'

const MedicineController = {
  getMedicines: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const { data, pagination } = await MedicineService.getMedicinesService(userId, req.query)
    new OK({
      data: {
        items: data,
        pagination
      }
    }).send(res)
  }),

  getMedicineById: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const _id = req.params._id as string
    const response = await MedicineService.getMedicineByIdService(userId, _id)
    new OK({ data: response }).send(res)
  }),

  createMedicine: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const response = await MedicineService.createMedicineService(userId, req.body)
    new CREATED({ data: response }).send(res)
  }),

  updateMedicine: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const _id = req.params._id as string
    const response = await MedicineService.updateMedicineService(userId, _id, req.body)
    new OK({ data: response }).send(res)
  }),

  deleteMedicine: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const _id = req.params._id as string
    await MedicineService.deleteMedicineService(userId, _id)
    new DELETED().send(res)
  })
}

export default MedicineController
