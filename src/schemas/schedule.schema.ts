import { z } from 'zod'
import { objectIdSchema, timeSlotSchema } from './common.schema'

export const scheduleBodySchema = z.object(
  {
    doctorID: objectIdSchema,
    cost: z.number({ message: 'Vui lòng nhập đúng kiểu dữ liệu' }),
    date: z.date().min(new Date(), 'Ngày phải lớn hơn hoặc bằng ngày hiện tại'),
    timeSlots: z.array(
      z.object({
        time: timeSlotSchema,
        maxNumber: z.number({ message: 'Vui lòng nhập đúng kiểu dữ liệu' }).default(3),
        bookedCount: z.number({ message: 'Vui lòng nhập đúng kiểu dữ liệu' }).default(0)
      })
    )
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
