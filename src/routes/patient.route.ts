import express from 'express'
import PatientController from '~/controllers/patient.controller'
import { verifyAccessToken } from '~/middlewares/auth.middleware'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { patientBodySchema } from '~/schemas/patient.schema'

const router = express.Router()

router.get('/', [verifyAccessToken], PatientController.getPatients)

router.get('/:_id', [verifyAccessToken], PatientController.getPatientById)

router.post('/', [verifyAccessToken], validateRequestBody(patientBodySchema), PatientController.createPatient)

router.put(
  '/:_id',
  [verifyAccessToken],
  validateRequestParams(paramsSchema),
  validateRequestBody(patientBodySchema.partial()),
  PatientController.updatePatient
)

router.delete('/:_id', [verifyAccessToken], validateRequestParams(paramsSchema), PatientController.deletePatient)

export default router
