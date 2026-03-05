import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import RecordService from '~/services/record.service'

const RecordController = {
  getRecords: asyncHandler(async (req: Request, res: Response) => {
    const { data, pagination } = await RecordService.getRecordsService(req.query)
    new OK({
      data: {
        items: data,
        pagination
      }
    }).send(res)
  }),

  getRecordById: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await RecordService.getRecordByIdService(_id)
    new OK({ data: response }).send(res)
  }),

  createRecord: asyncHandler(async (req: Request, res: Response) => {
    const doctorId = req.user?._id.toString() as string
    const response = await RecordService.createRecordService(doctorId, req.body)
    new CREATED({ data: response }).send(res)
  }),

  updateRecord: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const doctorId = req.user?._id.toString() as string
    const response = await RecordService.updateRecordService(doctorId, _id, req.body)
    new OK({ data: response }).send(res)
  }),

  deleteRecord: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const doctorId = req.user?._id.toString() as string
    await RecordService.deleteRecordService(doctorId, _id)
    new DELETED().send(res)
  })
}

export default RecordController
