import express from 'express'
import { RoleCode } from '~/constants/enums'
import RecordController from '~/controllers/record.controller'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { recordBodySchema } from '~/schemas/record.schema'

const router = express.Router()

router.get('/', RecordController.getRecords)

router.get('/:_id', RecordController.getRecordById)

router.post(
  '/',
  [verifyAccessToken, authorizeRoles(RoleCode.DOCTOR)],
  validateRequestBody(recordBodySchema),
  RecordController.createRecord
)

router.put(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.DOCTOR)],
  validateRequestParams(paramsSchema),
  validateRequestBody(recordBodySchema.partial()),
  RecordController.updateRecord
)

router.delete(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.DOCTOR)],
  validateRequestParams(paramsSchema),
  RecordController.deleteRecord
)

export default router
