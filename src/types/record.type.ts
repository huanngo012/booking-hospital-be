import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, MedicineItem, QueryParams } from './base.type'

export interface Record extends BaseDocument {
  patientID: Types.ObjectId
  doctorID: Types.ObjectId
  bookingID: Types.ObjectId
  diagnosis?: string
  medicines?: MedicineItem[]
  totalPrice: number
}

export interface RecordQueryParams extends QueryParams {
  patientID?: string
}

export interface RecordBody {
  patientID: string
  doctorID: string
  bookingID: string
  diagnosis?: string
  medicines?: MedicineItem[]
  totalPrice: number
}

export type RecordDocument = HydratedDocument<Record>
