import z from 'zod'
import { TimeSlotCode } from '~/constants/enums'

export const requiredString = (message: string) => z.string(message).trim().min(1, message)

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID không hợp lệ')

export const addressSchema = z.object(
  {
    province: requiredString('Vui lòng nhập tỉnh/thành phố'),
    district: z.string().optional(),
    ward: requiredString('Vui lòng nhập phường/xã'),
    detail: requiredString('Vui lòng nhập địa chỉ chi tiết')
  },
  {
    message: 'Vui lòng nhập địa chỉ'
  }
)

export const ratingSchema = z.object({
  userId: objectIdSchema,
  score: z.number().min(1).max(5),
  comment: z.string().optional()
})

export const timeSlotSchema = z.enum(TimeSlotCode, {
  error: 'Vui lòng chọn đúng giờ'
})

export const breakTimeSchema = z.object({
  start: timeSlotSchema,
  end: timeSlotSchema
})
export const workingTimeSchema = z
  .object({
    dayOfWeek: z.coerce.number().int().min(0).max(6),

    startTime: timeSlotSchema,
    endTime: timeSlotSchema,

    breakTimes: z.array(breakTimeSchema).optional()
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'Giờ bắt đầu phải nhỏ hơn giờ kết thúc'
  })

export const paramsSchema = z.object({
  _id: objectIdSchema
})
