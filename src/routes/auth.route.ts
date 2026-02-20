import express from 'express'
import { validateRequestBody } from '~/middlewares/validation.middlewares'
import { loginBodySchema, registerBodySchema } from '~/schemas/auth.schema'
import AuthController from '~/controllers/auth.controller'

const router = express.Router()

router.post('/register', validateRequestBody(registerBodySchema), AuthController.register)
router.post('/login', validateRequestBody(loginBodySchema), AuthController.login)
router.post('/logout', AuthController.logout)

export default router
