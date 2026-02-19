import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument } from './base.type'
import { BookingStatus } from '~/constants/enums'

export interface Booking extends BaseDocument {
  patientID: Types.ObjectId
  scheduleID: Types.ObjectId
  timeSlot: string
  description?: string
  descriptionImages?: string[]
  status: BookingStatus
  bookingFee?: number
  bookingPaid?: boolean
  qrCode?: string
  isPaid: boolean
}

export type BookingDocument = HydratedDocument<Booking>
