import { z } from 'zod'

export const specialtyBodySchema = z.object(
  {
    name: z
      .string({ message: 'Vui lòng nhập đúng kiểu dữ liệu' })
      .trim()
      .min(1, 'Vui lòng nhập đầy đủ')
      .max(50, 'Tag tối đa 50 ký tự')
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
