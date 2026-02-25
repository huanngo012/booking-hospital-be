import z from 'zod'
import { Gender } from '~/constants/enums'
import { objectIdSchema } from './common.schema'

const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/

export const patientBodySchema = z.object(
  {
    name: z
      .string()
      .min(1, { message: 'Vui lòng nhập đầy đủ họ tên' })
      .max(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
      .trim(),
    phone: z
      .string()
      .trim()
      .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, {
        message: 'Số điện thoại không hợp lệ'
      }),
    gender: z.enum(Gender, {
      error: 'Vui lòng chọn giới tính'
    }),
    bookedBy: objectIdSchema
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
