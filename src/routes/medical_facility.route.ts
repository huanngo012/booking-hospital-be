import express from 'express'
import MedicalFacilityController from '~/controllers/medical_facility.controller'
import { validateRequestBody } from '~/middlewares/validation.middleware'
import { medicalFacilityBodySchema } from '~/schemas/medical_facility.schema'

const router = express.Router()

router.post('/', validateRequestBody(medicalFacilityBodySchema), MedicalFacilityController.createMedicalFacility)

export default router
