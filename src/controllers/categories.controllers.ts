import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { createCategoryService } from '~/services/categories.services'
import { CreateCategoryInput } from '~/validations/category.schema'

export const createCategory = asyncHandler(async (req: BodyRequest<CreateCategoryInput>, res: Response) => {
  const { tag } = req.body

  const response = await createCategoryService(tag)

  res.status(201).json({
    success: true,
    data: response
  })
})
