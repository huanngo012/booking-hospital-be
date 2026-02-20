import express from 'express'
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '~/middlewares/validation.middlewares'
import CategoryController from '~/controllers/category.controller'
import { categoryBodySchema, categoryQuerySchema } from '~/schemas/category.schema'
import { paramsSchema } from '~/schemas/common.schema'

const router = express.Router()

router.get('/', validateRequestQuery(categoryQuerySchema), CategoryController.getCategories)
router.get('/:_id', validateRequestParams(paramsSchema), CategoryController.getCategory)
router.post('/', validateRequestBody(categoryBodySchema), CategoryController.createCategory)
router.put(
  '/:_id',
  validateRequestParams(paramsSchema),
  validateRequestBody(categoryBodySchema.partial()),
  CategoryController.updateCategory
)
router.delete('/:_id', validateRequestParams(paramsSchema), CategoryController.deleteCategory)

export default router
