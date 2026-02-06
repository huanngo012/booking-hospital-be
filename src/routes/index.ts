import express from 'express'
import { errHandler, notFound } from '~/middlewares/error.middlewares'
import categories from './categories.routes'

const router = express.Router()

router.use('/category', categories)
router.use(notFound)
router.use(errHandler)

export default router
