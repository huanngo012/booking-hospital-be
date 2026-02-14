import express from 'express'
import { validate } from '~/middlewares/validation.middlewares'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory
} from '~/controllers/categories.controllers'
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategoriesSchema,
  getCategorySchema,
  updateCategorySchema
} from '~/validators/category.schema'

const router = express.Router()

router.get('/', validate(getCategoriesSchema), getCategories)
router.get('/:_id', validate(getCategorySchema), getCategory)
router.post('/', validate(createCategorySchema), createCategory)
router.put('/:_id', validate(updateCategorySchema), updateCategory)
router.delete('/:_id', validate(deleteCategorySchema), deleteCategory)

export default router
