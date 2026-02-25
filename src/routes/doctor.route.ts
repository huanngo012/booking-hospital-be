import express from 'express'
import { RoleCode } from '~/constants/enums'
import DoctorController from '~/controllers/doctor.controller'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { doctorBodySchema } from '~/schemas/doctor.schema'

const router = express.Router()

router.get('/', DoctorController.getDoctors)

router.get('/:slug', DoctorController.getDoctorBySlug)

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
