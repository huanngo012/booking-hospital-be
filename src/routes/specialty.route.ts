import express from 'express'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import SpecialtyController from '~/controllers/specialty.controller'
import { specialtyBodySchema } from '~/schemas/specialty.schema'
import { paramsSchema } from '~/schemas/common.schema'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { RoleCode } from '~/constants/enums'

const router = express.Router()

router.get('/', SpecialtyController.getSpecialties)

router.get('/:slug', SpecialtyController.getSpecialtyBySlug)

router.post(
  '/',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestBody(specialtyBodySchema),
  SpecialtyController.createSpecialty
)

router.put(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  validateRequestBody(specialtyBodySchema.partial()),
  SpecialtyController.updateSpecialty
)

router.delete(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  SpecialtyController.deleteSpecialty
)

export default router
