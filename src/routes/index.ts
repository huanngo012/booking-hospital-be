import express from 'express'
import { errorHandler, notFound } from '~/middlewares/error.middleware'
import category from './category.route'
import specialty from './specialty.route'
import auth from './auth.route'
import medical_facility from './medical_facility.route'
import booking from './booking.route'
import doctor from './doctor.route'
import invoice from './invoice.route'
import medicine from './medicine.route'
import patient from './patient.route'
import record from './record.route'
import schedule from './schedule.route'
import user from './user.route'

const router = express.Router()

router.use('/auth', auth)
router.use('/user', user)
router.use('/category', category)
router.use('/specialty', specialty)
router.use('/medical-facility', medical_facility)
router.use('/booking', booking)
router.use('/doctor', doctor)
router.use('/invoice', invoice)
router.use('/medicine', medicine)
router.use('/patient', patient)
router.use('/record', record)
router.use('/schedule', schedule)
router.use(notFound)
router.use(errorHandler)

export default router
