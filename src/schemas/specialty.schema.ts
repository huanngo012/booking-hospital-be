import { z } from 'zod'
import { paramsSchema, querySchema } from './common.schema'

const specialtyNameSchema = z
  .string({ message: 'Vui lòng nhập đúng kiểu dữ liệu' })
  .trim()
  .min(1, 'Vui lòng nhập đầy đủ')
  .max(50, 'Tag tối đa 50 ký tự')

export const specialtyBodySchema = z.object(
  {
    name: specialtyNameSchema,
    description: z.string().optional(),
    image: z.string().optional()
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
export const specialtyQuerySchema = querySchema.extend({
  name: z.string().optional()
})

export type SpecialtyParams = z.infer<typeof paramsSchema>
export type SpecialtyBody = z.infer<typeof specialtyBodySchema>
export type SpecialtyQuery = z.infer<typeof specialtyQuerySchema>
