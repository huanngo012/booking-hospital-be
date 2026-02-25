import z from 'zod'
import { RoleCode } from '~/constants/enums'

const userEmailSchema = z.email({ message: 'Vui lòng nhập đúng định dạng email' }).trim()
const userPasswordSchema = z
  .string()
  .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  .max(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' })
const userNameSchema = z
  .string()
  .min(1, { message: 'Vui lòng nhập đầy đủ họ tên' })
  .max(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
  .trim()

export const userBodySchema = z.object(
  {
    name: userNameSchema,
    email: userEmailSchema,
    password: userPasswordSchema,
    avatar: z.string().optional(),
    address: z.string().optional(),
    role: z.enum(RoleCode).optional(),
    isBlocked: z.boolean().optional(),
    isVerified: z.boolean().optional()
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
