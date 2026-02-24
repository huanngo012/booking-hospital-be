import express from 'express'
import MedicalFacilityController from '~/controllers/medical_facility.controller'
import { upload } from '~/middlewares/file.middleware'
import { validateRequestBody } from '~/middlewares/validation.middleware'
import { medicalFacilityBodySchema } from '~/schemas/medical_facility.schema'

const router = express.Router()

router.post(
  '/',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]),
  validateRequestBody(medicalFacilityBodySchema),
  MedicalFacilityController.createMedicalFacility
)

export default router
