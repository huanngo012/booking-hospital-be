import { z } from 'zod'
import { objectIdSchema } from './common.schema'

export const medicineBodySchema = z.object(
  {
    name: z
      .string({ message: 'Vui lòng nhập đúng kiểu dữ liệu' })
      .trim()
      .min(1, 'Vui lòng nhập đầy đủ')
      .max(50, 'Tag tối đa 50 ký tự'),
    specialtyID: objectIdSchema,
    price: z.number({ message: 'Vui lòng nhập đúng kiểu dữ liệu' }),
    stock: z.number({ message: 'Vui lòng nhập đúng kiểu dữ liệu' })
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
