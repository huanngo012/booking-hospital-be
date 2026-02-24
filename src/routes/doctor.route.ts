import express from 'express'
import { RoleCode } from '~/constants/enums'
import DoctorController from '~/controllers/doctor.controller'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { doctorBodySchema, doctorQuerySchema } from '~/schemas/doctor.schema'

const router = express.Router()

router.get('/', validateRequestQuery(doctorQuerySchema), DoctorController.getDoctors)
router.get('/:_id', validateRequestParams(paramsSchema), DoctorController.getDoctor)
router.post(
  '/',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestBody(doctorBodySchema),
  DoctorController.createDoctor
)
router.put(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  validateRequestBody(doctorBodySchema.partial()),
  DoctorController.updateDoctor
)
router.delete(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  DoctorController.deleteDoctor
)
export default router
