import express from 'express'
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '~/middlewares/validation.middleware'
import SpecialtyController from '~/controllers/specialty.controller'
import { specialtyBodySchema, specialtyQuerySchema } from '~/schemas/specialty.schema'
import { paramsSchema } from '~/schemas/common.schema'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { RoleCode } from '~/constants/enums'

const router = express.Router()

router.get('/', validateRequestQuery(specialtyQuerySchema), SpecialtyController.getSpecialties)
router.get('/:_id', validateRequestParams(paramsSchema), SpecialtyController.getSpecialty)
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
