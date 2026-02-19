import express from 'express'
import { validate } from '~/middlewares/validation.middlewares'
import CategoryController from '~/controllers/categories.controller'
import {
  createCategorySchema,
  deleteCategorySchema,
  getCategoriesSchema,
  getCategorySchema,
  updateCategorySchema
} from '~/validators/category.schema'

const router = express.Router()

router.get('/', validate(getCategoriesSchema), CategoryController.getCategories)
router.get('/:_id', validate(getCategorySchema), CategoryController.getCategory)
router.post('/', validate(createCategorySchema), CategoryController.createCategory)
router.put('/:_id', validate(updateCategorySchema), CategoryController.updateCategory)
router.delete('/:_id', validate(deleteCategorySchema), CategoryController.deleteCategory)

export default router
