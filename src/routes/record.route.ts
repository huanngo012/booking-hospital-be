import express from 'express'
import RecordController from '~/controllers/record.controller'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { recordBodySchema } from '~/schemas/record.schema'

const router = express.Router()

router.get('/', RecordController.getRecords)

router.get('/:_id', RecordController.getRecordById)

router.post('/', validateRequestBody(recordBodySchema), RecordController.createRecord)

router.put(
  '/:_id',
  validateRequestParams(paramsSchema),
  validateRequestBody(recordBodySchema.partial()),
  RecordController.updateRecord
)

router.delete('/:_id', validateRequestParams(paramsSchema), RecordController.deleteRecord)

export default router
