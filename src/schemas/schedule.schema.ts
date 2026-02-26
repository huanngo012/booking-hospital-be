import { z } from 'zod'
import { objectIdSchema, timeSlotSchema } from './common.schema'

export const scheduleBodySchema = z.object(
  {
    doctorID: objectIdSchema,
    cost: z.number({ message: 'Vui lòng nhập cost đúng kiểu dữ liệu' }),
    date: z.coerce
      .date({ message: 'Vui lòng nhập date đúng kiểu dữ liệu' })
      .min(new Date(), 'Ngày phải lớn hơn hoặc bằng ngày hiện tại'),
    timeSlots: z.array(
      z
        .object({
          _id: objectIdSchema.optional(),
          time: timeSlotSchema,
          maxNumber: z.number({ message: 'Vui lòng nhập maxNumber đúng kiểu dữ liệu' }).default(3)
        })
        .strict(),
      { message: 'Vui lòng nhập timeSlots đúng kiểu dữ liệu' }
    )
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
