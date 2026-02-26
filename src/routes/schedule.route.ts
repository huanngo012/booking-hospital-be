import express from 'express'
import { RoleCode } from '~/constants/enums'
import ScheduleController from '~/controllers/schedule.controller'
import authorizeRoles, { verifyAccessToken } from '~/middlewares/auth.middleware'
import { validateRequestBody, validateRequestParams } from '~/middlewares/validation.middleware'
import { paramsSchema } from '~/schemas/common.schema'
import { scheduleBodySchema } from '~/schemas/schedule.schema'

const router = express.Router()

router.get('/', ScheduleController.getSchedules)

router.get('/:_id', ScheduleController.getScheduleById)

router.post(
  '/',
  [verifyAccessToken, authorizeRoles(RoleCode.HOST)],
  validateRequestBody(scheduleBodySchema),
  ScheduleController.createSchedule
)

router.put(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.HOST)],
  validateRequestParams(paramsSchema),
  validateRequestBody(scheduleBodySchema.partial()),
  ScheduleController.updateSchedule
)

router.delete(
  '/:_id',
  [verifyAccessToken, authorizeRoles(RoleCode.HOST)],
  validateRequestParams(paramsSchema),
  ScheduleController.deleteSchedule
)

export default router
