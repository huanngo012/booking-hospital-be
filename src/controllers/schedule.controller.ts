import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import ScheduleService from '~/services/schedule.service'

const ScheduleController = {
  getSchedules: asyncHandler(async (req: Request, res: Response) => {
    const { data, pagination } = await ScheduleService.getSchedulesService(req.query)
    new OK({ data, pagination }).send(res)
  }),

  getScheduleById: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const response = await ScheduleService.getScheduleByIdService(_id)
    new OK({ data: response }).send(res)
  }),

  createSchedule: asyncHandler(async (req: Request, res: Response) => {
    const hostId = req.user?._id.toString() as string
    const response = await ScheduleService.createScheduleService(hostId, req.body)
    new CREATED({ data: response }).send(res)
  }),

  updateSchedule: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    const hostId = req.user?._id.toString() as string
    const response = await ScheduleService.updateScheduleService(hostId, _id, req.body)
    new OK({ data: response }).send(res)
  }),

  deleteSchedule: asyncHandler(async (req: Request, res: Response) => {
    const _id = req.params._id as string
    await ScheduleService.deleteScheduleService(_id)
    new DELETED().send(res)
  })
}

export default ScheduleController
