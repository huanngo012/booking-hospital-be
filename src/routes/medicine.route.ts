import express from 'express'
import MedicineController from '~/controllers/medicine.controller'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { medicineBodySchema } from '~/schemas/medicine.schema'

const router = express.Router()

router.get('/', MedicineController.getMedicines)

router.get('/:_id', MedicineController.getMedicineById)

router.post('/', validateRequestBody(medicineBodySchema), MedicineController.createMedicine)

router.put(
  '/:_id',
  validateRequestParams(paramsSchema),
  validateRequestBody(medicineBodySchema.partial()),
  MedicineController.updateMedicine
)

router.delete('/:_id', validateRequestParams(paramsSchema), MedicineController.deleteMedicine)

export default router
