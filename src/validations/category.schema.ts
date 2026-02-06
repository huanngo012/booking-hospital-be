import { z } from 'zod'

export const categoryTagSchema = z
  .string({ message: 'Vui lòng nhập tag' })
  .trim()
  .min(1, 'Vui lòng nhập đầy đủ')
  .max(50, 'Tag tối đa 50 ký tự')

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID không hợp lệ')

export const createCategorySchema = z.object({
  body: z.object(
    {
      tag: categoryTagSchema
    },
    {
      message: 'Vui lòng nhập dữ liệu'
    }
  )
})

export const deleteCategorySchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body']
export type DeleteategoryInput = z.infer<typeof deleteCategorySchema>['params']
