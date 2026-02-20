import express from 'express'
import { validateRequestBody, validateRequestParams, validateRequestQuery } from '~/middlewares/validation.middlewares'
import SpecialtyController from '~/controllers/specialty.controller'
import { specialtyBodySchema, specialtyQuerySchema } from '~/schemas/specialty.schema'
import { paramsSchema } from '~/schemas/common.schema'

const router = express.Router()

router.get('/', validateRequestQuery(specialtyQuerySchema), SpecialtyController.getSpecialties)
router.get('/:_id', validateRequestParams(paramsSchema), SpecialtyController.getSpecialty)
router.post('/', validateRequestBody(specialtyBodySchema), SpecialtyController.createSpecialty)
router.put(
  '/:_id',
  validateRequestParams(paramsSchema),
  validateRequestBody(specialtyBodySchema.partial()),
  SpecialtyController.updateSpecialty
)
router.delete('/:_id', validateRequestParams(paramsSchema), SpecialtyController.deleteSpecialty)

export default router
