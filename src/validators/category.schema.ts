import { z } from 'zod'

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional()
})

const categoryTagSchema = z
  .string({ message: 'Vui lòng nhập đúng kiểu dữ liệu' })
  .trim()
  .min(1, 'Vui lòng nhập đầy đủ')
  .max(50, 'Tag tối đa 50 ký tự')

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID không hợp lệ')

const categoryParamsSchema = z.object({
  _id: objectIdSchema
})

const categoryBodySchema = z.object(
  {
    tag: categoryTagSchema
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
const getCategoriesQuerySchema = z
  .object({
    tag: z.string().optional(),
    sort: z.string().optional(),
    fields: z.string().optional()
  })
  .merge(paginationSchema)

export const getCategoriesSchema = z.object({
  query: getCategoriesQuerySchema
})
export const getCategorySchema = z.object({
  params: categoryParamsSchema
})
export const createCategorySchema = z.object({
  body: categoryBodySchema
})

export const updateCategorySchema = z.object({
  params: categoryParamsSchema,
  body: categoryBodySchema.partial()
})

export const deleteCategorySchema = z.object({
  params: categoryParamsSchema
})

export type CategoryParams = z.infer<typeof categoryParamsSchema>
export type CategoryBody = z.infer<typeof categoryBodySchema>
export type CategoryQuery = z.infer<typeof getCategoriesQuerySchema>
