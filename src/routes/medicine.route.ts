import express from 'express'
import { RoleCode } from '~/constants/enums'
import MedicineController from '~/controllers/medicine.controller'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { medicineBodySchema } from '~/schemas/medicine.schema'

const router = express.Router()

router.get('/', [verifyAccessToken, authorizeRoles(RoleCode.HOST)], MedicineController.getMedicines)

router.get('/:_id', [verifyAccessToken, authorizeRoles(RoleCode.HOST)], MedicineController.getMedicineById)

router.post(
  '/',
  [verifyAccessToken, authorizeRoles(RoleCode.HOST)],
  validateRequestBody(medicineBodySchema),
  MedicineController.createMedicine
)

router.put(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.HOST)],
  validateRequestParams(paramsSchema),
  validateRequestBody(medicineBodySchema.partial()),
  MedicineController.updateMedicine
)

router.delete(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.HOST)],
  validateRequestParams(paramsSchema),
  MedicineController.deleteMedicine
)

export default router
