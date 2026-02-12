import asyncHandler from 'express-async-handler'
import { Response } from 'express'
import { createCategoryService, deleteCategoryService, updateCategoryService } from '~/services/categories.services'
import { CategoryBody, CategoryParams, CategoryQuery } from '~/validators/category.schema'

// export const getCategories = asyncHandler(async (req: QueryRequest<CategoryQuery>, res: Response) => {
//   const response = await res.status(201).json({
//     success: true,
//     data: response
//   })
// })

export const createCategory = asyncHandler(async (req: BodyRequest<CategoryBody>, res: Response) => {
  const response = await createCategoryService(req.body)
  res.status(201).json({
    success: true,
    data: response
  })
})

export const updateCategory = asyncHandler(
  async (req: ParamsBodyRequest<CategoryParams, CategoryBody>, res: Response) => {
    const response = await updateCategoryService(req.params, req.body)
    res.status(200).json({
      success: true,
      data: response
    })
  }
)

export const deleteCategory = asyncHandler(async (req: ParamsRequest<CategoryParams>, res: Response) => {
  await deleteCategoryService(req.params)
  res.status(200).json({
    success: true
  })
})
