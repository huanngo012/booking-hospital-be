import { z } from 'zod'
import { paramsSchema, querySchema } from './common.schema'

const categoryTagSchema = z
  .string({ message: 'Vui lòng nhập đúng kiểu dữ liệu' })
  .trim()
  .min(1, 'Vui lòng nhập đầy đủ')
  .max(50, 'Tag tối đa 50 ký tự')

export const categoryBodySchema = z.object(
  {
    tag: categoryTagSchema
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
export const categoryQuerySchema = z
  .object({
    tag: z.string().optional()
  })
  .merge(querySchema)

export type CategoryParams = z.infer<typeof paramsSchema>
export type CategoryBody = z.infer<typeof categoryBodySchema>
export type CategoryQuery = z.infer<typeof categoryQuerySchema>
