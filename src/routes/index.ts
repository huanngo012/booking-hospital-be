import express from 'express'
import { errorHandler, notFound } from '~/middlewares/error.middlewares'
import categories from './categories.routes'

const router = express.Router()

router.use('/category', categories)
router.use(notFound)
router.use(errorHandler)

export default router
