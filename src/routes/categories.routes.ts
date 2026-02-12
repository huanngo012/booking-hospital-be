import express from 'express'
import { validate } from '~/middlewares/validation.middlewares'
import { createCategory, deleteCategory, updateCategory } from '~/controllers/categories.controllers'
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from '~/validators/category.schema'

const router = express.Router()

router.post('/', validate(createCategorySchema), createCategory)
router.put('/:_id', validate(updateCategorySchema), updateCategory)
router.delete('/:_id', validate(deleteCategorySchema), deleteCategory)

export default router
