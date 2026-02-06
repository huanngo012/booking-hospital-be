import express from 'express'
import { createCategory, deleteCategory } from '~/controllers/categories.controllers'
import { validate } from '~/middlewares/validation.middlewares'
import { createCategorySchema, deleteCategorySchema } from '~/validations/category.schema'

const router = express.Router()

router.post('/', validate(createCategorySchema), createCategory)
router.delete('/:id', validate(deleteCategorySchema), deleteCategory)

export default router
