import { z } from 'zod'
import { objectIdSchema } from './common.schema'

export const recordBodySchema = z.object(
  {
    patientID: objectIdSchema,
    doctorID: objectIdSchema,
    bookingID: objectIdSchema,
    medicalFacilityID: objectIdSchema,
    specialtyID: objectIdSchema,
    totalPrice: z.number({ message: 'Vui lòng nhập đúng kiểu dữ liệu' })
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
