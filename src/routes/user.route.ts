import express from 'express'
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '~/middlewares/validation.middleware'
import UserController from '~/controllers/user.controller'
import { paramsSchema } from '~/schemas/common.schema'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { userBodySchema, userQuerySchema } from '~/schemas/user.schema'
import { RoleCode } from '~/constants/enums'

const router = express.Router()

router.get(
  '/',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestQuery(userQuerySchema),
  UserController.getUsers
)
router.get(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  UserController.getUser
)
router.post(
  '/',
  // [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestBody(userBodySchema),
  UserController.createUser
)
router.put(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  validateRequestBody(userBodySchema.partial()),
  UserController.updateUser
)
router.delete(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  UserController.deleteUser
)

export default router
