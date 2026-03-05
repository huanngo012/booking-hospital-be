import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { CREATED, DELETED, OK } from '~/core/success.response'
import BookingService from '~/services/booking.service'

const BookingController = {
  getBookings: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const { data, pagination } = await BookingService.getBookingsService(userId, req.query)
    new OK({
      data: {
        items: data,
        pagination
      }
    }).send(res)
  }),

  getBookingById: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const id = req.params.id as string
    const response = await BookingService.getBookingByIdService(userId, id)
    new OK({ data: response }).send(res)
  }),

  createBooking: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const response = await BookingService.createBookingService(userId, req.body, req.files)
    new CREATED({ data: response }).send(res)
  }),

  updateBooking: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const _id = req.params._id as string
    const response = await BookingService.updateBookingService(userId, _id, req.body, req.files)
    new OK({ data: response }).send(res)
  }),
  cancelBooking: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const _id = req.params._id as string
    const response = await BookingService.cancelBookingByUserService(userId, _id)
    new OK({ data: response }).send(res)
  }),

  cancelBookingByUser: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id.toString() as string
    const _id = req.params._id as string
    await BookingService.cancelBookingByUserService(userId, _id)
    new DELETED().send(res)
  })
}

export default BookingController
