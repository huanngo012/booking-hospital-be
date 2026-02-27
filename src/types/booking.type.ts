import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, QueryParams } from './base.type'
import { BookingStatus, TimeSlotCode } from '~/constants/enums'

export interface Booking extends BaseDocument {
  patientID: Types.ObjectId
  doctorID: Types.ObjectId
  scheduleID: Types.ObjectId
  date: Date
  timeSlot: TimeSlotCode
  description?: string
  descriptionImages?: string[]
  status: BookingStatus
  bookingFee?: number
  bookingPaid?: boolean
  qrCode?: string
}

export interface BookingFiles {
  descriptionImages?: Express.Multer.File[]
}

export interface BookingQueryParams extends QueryParams {
  status?: BookingStatus
  scheduleID?: string
  patientID?: string
}

export interface BookingBody {
  patientID: string
  scheduleID: string
  timeSlot: TimeSlotCode
  description?: string
  descriptionImages?: string[]
}
export interface UpdateBookingBody {
  timeSlot?: TimeSlotCode
  description?: string
  descriptionImages?: string[]
}

export type BookingDocument = HydratedDocument<Booking>
