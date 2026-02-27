import { BookingStatus } from '~/constants/enums'
import { BadRequestError } from '~/core/error.response'
import { BookingModel } from '~/models/Booking'

const validateBooking = async (_id: string) => {
  const bookingExists = await BookingModel.exists({ _id })
  if (!bookingExists) throw new BadRequestError('Lịch đặt không tồn tại')
}

const validateDuplicateBooking = async (patientID: string, scheduleID: string, timeSlot: string) => {
  const exists = await BookingModel.exists({
    patientID,
    scheduleID,
    timeSlot,
    status: { $ne: BookingStatus.CANCELLED }
  })

  if (exists) {
    throw new BadRequestError('Bạn đã đặt khung giờ này rồi')
  }
}

export { validateBooking, validateDuplicateBooking }
