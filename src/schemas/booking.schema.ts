import z from 'zod'
import { objectIdSchema, timeSlotSchema } from './common.schema'

export const bookingBodySchema = z.object(
  {
    patientID: objectIdSchema,
    scheduleID: objectIdSchema,
    timeSlot: timeSlotSchema
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
