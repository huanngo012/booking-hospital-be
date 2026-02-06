import asyncHandler from 'express-async-handler'
import { Response } from 'express'
import { createCategoryService, deleteCategoryService } from '~/services/categories.services'
import { CreateCategoryInput, DeleteategoryInput } from '~/validations/category.schema'

export const createCategory = asyncHandler(async (req: BodyRequest<CreateCategoryInput>, res: Response) => {
  const { tag } = req.body
  const response = await createCategoryService(tag)
  res.status(201).json({
    success: true,
    data: response
  })
})

export const deleteCategory = asyncHandler(async (req: ParamsRequest<DeleteategoryInput>, res: Response) => {
  const { id } = req.params
  await deleteCategoryService(id)
  res.status(200).json({
    success: true
  })
})
