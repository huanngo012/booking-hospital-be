import express from 'express'
import { RoleCode } from '~/constants/enums'
import MedicalFacilityController from '~/controllers/medical_facility.controller'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { upload } from '~/middlewares/file.middleware'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { medicalFacilityBodySchema } from '~/schemas/medical_facility.schema'

const router = express.Router()

router.get('/', MedicalFacilityController.getMedicalFacilities)

router.get('/:slug', MedicalFacilityController.getMedicalFacilityBySlug)

router.post(
  '/',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  validateRequestBody(medicalFacilityBodySchema),
  MedicalFacilityController.createMedicalFacility
)

router.put(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  validateRequestParams(paramsSchema),
  validateRequestBody(medicalFacilityBodySchema.partial()),
  MedicalFacilityController.updateMedicalFacility
)

router.delete(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.ADMIN)],
  validateRequestParams(paramsSchema),
  MedicalFacilityController.deleteMedicalFacility
)
export default router
