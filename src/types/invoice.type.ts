import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, InvoiceItem } from './base.type'
import { InvoiceStatus } from '~/constants/enums'

export interface Invoice extends BaseDocument {
  patientID: Types.ObjectId
  bookingID: Types.ObjectId
  recordID: Types.ObjectId
  medicalFacilityID: Types.ObjectId
  items: InvoiceItem[]
  totalAmount: number
  paidAmount: number
  status: InvoiceStatus
}

export type InvoiceDocument = HydratedDocument<Invoice>
