import express from 'express'
import { createCategory } from '~/controllers/categories.controllers'
import { validate } from '~/middlewares/validation.middlewares'
import { createCategorySchema } from '~/validations/category.schema'

const router = express.Router()

router.post('/', validate(createCategorySchema), createCategory)

export default router
