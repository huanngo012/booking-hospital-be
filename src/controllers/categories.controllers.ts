import asyncHandler from 'express-async-handler'
import { Request, Response } from 'express'
import { createCategoryService } from '~/services/categories.services'

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { tag } = req.body

  const response = await createCategoryService(tag)

  res.status(201).json({
    success: true,
    data: response
  })
})
