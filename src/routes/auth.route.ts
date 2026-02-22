import express from 'express'
import { validateRequestBody } from '~/middlewares/validation.middleware'
import { loginBodySchema, profileBodySchema, registerBodySchema } from '~/schemas/auth.schema'
import AuthController from '~/controllers/auth.controller'
import { verifyAccessToken } from '~/middlewares/auth.middleware'

const router = express.Router()

router.post('/register', validateRequestBody(registerBodySchema), AuthController.register)
router.post('/login', validateRequestBody(loginBodySchema), AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/refreshtoken', AuthController.refreshToken)
router.get('/current', [verifyAccessToken], AuthController.getCurrentUser)
router.put('/current', [verifyAccessToken], validateRequestBody(profileBodySchema), AuthController.updateCurrentUser)

export default router
