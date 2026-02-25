import z from 'zod'
import { RoleCode } from '~/constants/enums'

export const userBodySchema = z.object(
  {
    name: z
      .string()
      .min(1, { message: 'Vui lòng nhập đầy đủ họ tên' })
      .max(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
      .trim(),
    email: z.email({ message: 'Vui lòng nhập đúng định dạng email' }).trim(),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
      .max(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' }),
    role: z
      .enum(RoleCode, {
        error: 'Vui lòng nhập đúng vai trò (ADMIN, HOST, DOCTOR, USER)'
      })
      .optional()
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
