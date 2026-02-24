import express from 'express'
import { RoleCode } from '~/constants/enums'
import MedicalFacilityController from '~/controllers/medical_facility.controller'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { upload } from '~/middlewares/file.middleware'
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { medicalFacilityBodySchema, medicalFacilityQuerySchema } from '~/schemas/medical_facility.schema'

const router = express.Router()

router.get('/', validateRequestQuery(medicalFacilityQuerySchema), MedicalFacilityController.getMedicalFacilities)
router.get('/:_id', validateRequestParams(paramsSchema), MedicalFacilityController.getMedicalFacility)
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
