import express from 'express'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import CategoryController from '~/controllers/category.controller'
import { categoryBodySchema } from '~/schemas/category.schema'
import { paramsSchema } from '~/schemas/common.schema'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { RoleCode } from '~/constants/enums'

const router = express.Router()

router.get('/', CategoryController.getCategories)

router.get('/:slug', CategoryController.getCategoryBySlug)

router.post(
  '/',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestBody(categoryBodySchema),
  CategoryController.createCategory
)

router.put(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  validateRequestBody(categoryBodySchema.partial()),
  CategoryController.updateCategory
)

router.delete(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  CategoryController.deleteCategory
)

export default router
