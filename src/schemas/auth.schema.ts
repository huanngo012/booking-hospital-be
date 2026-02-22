import z from 'zod'

const userEmailSchema = z.string().email({ message: 'Vui lòng nhập đúng định dạng email' }).trim()
const userPasswordSchema = z
  .string()
  .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  .max(100, { message: 'Mật khẩu không được vượt quá 100 ký tự' })
const userNameSchema = z
  .string()
  .min(1, { message: 'Vui lòng nhập đầy đủ họ tên' })
  .max(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
  .trim()

export const registerBodySchema = z.object(
  {
    email: userEmailSchema,
    password: userPasswordSchema,
    name: userNameSchema
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
export const loginBodySchema = z.object(
  {
    email: userEmailSchema,
    password: userPasswordSchema
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
export const profileBodySchema = z.object({
  name: userNameSchema.optional(),
  email: userEmailSchema.optional(),
  password: userPasswordSchema.optional(),
  newPassword: userPasswordSchema.optional(),
  avatar: z.string().optional(),
  address: z.string().optional()
})

export type RegisterBody = z.infer<typeof registerBodySchema>
export type LoginBody = z.infer<typeof loginBodySchema>
export type ProfileBody = z.infer<typeof profileBodySchema>
