import express from 'express'
import { createCategory } from '~/controllers/categories.controllers'

const router = express.Router()

router.post('/', createCategory)

export default router
