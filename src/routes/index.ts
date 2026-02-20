import express from 'express'
import { errorHandler, notFound } from '~/middlewares/error.middlewares'
import category from './category.route'
import specialty from './specialty.route'

const router = express.Router()

router.use('/category', category)
router.use('/specialty', specialty)
router.use(notFound)
router.use(errorHandler)

export default router
