import express from 'express'
import BookingController from '~/controllers/booking.controller'
import { verifyAccessToken } from '~/middlewares/auth.middleware'
import { upload } from '~/middlewares/file.middleware'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import { bookingBodySchema } from '~/schemas/booking.schema'
import { paramsSchema } from '~/schemas/common.schema'

const router = express.Router()

router.get('/', [verifyAccessToken], BookingController.getBookings)

router.get('/:_id', [verifyAccessToken], BookingController.getBookingById)

router.post(
  '/',
  [verifyAccessToken],
  upload.array('descriptionImages', 10),
  validateRequestBody(bookingBodySchema),
  BookingController.createBooking
)

router.put(
  '/:_id',
  [verifyAccessToken],
  validateRequestParams(paramsSchema),
  validateRequestBody(bookingBodySchema.partial()),
  BookingController.updateBooking
)

router.delete('/:_id', [verifyAccessToken], validateRequestParams(paramsSchema), BookingController.cancelBookingByUser)

export default router
