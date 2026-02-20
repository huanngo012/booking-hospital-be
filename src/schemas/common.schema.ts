import z from 'zod'

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional()
})

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID không hợp lệ')

export const paramsSchema = z.object({
  _id: objectIdSchema
})

export const querySchema = z
  .object({
    sort: z.string().optional(),
    fields: z.string().optional()
  })
  .merge(paginationSchema)
