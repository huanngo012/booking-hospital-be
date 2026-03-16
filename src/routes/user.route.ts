import express from 'express'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import UserController from '~/controllers/user.controller'
import { paramsSchema } from '~/schemas/common.schema'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { userBodySchema } from '~/schemas/user.schema'
import { RoleCode } from '~/constants/enums'
import { upload } from '~/middlewares/file.middleware'

const router = express.Router()

router.get('/', [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)], UserController.getUsers)

router.get(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  UserController.getUser
)

router.post(
  '/',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  upload.single('avatar'),
  validateRequestBody(userBodySchema),
  UserController.createUser
)

router.put(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  upload.single('avatar'),
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
