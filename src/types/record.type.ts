import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, MedicineItem } from './base.type'

export interface Record extends BaseDocument {
  patientID: Types.ObjectId
  doctorID: Types.ObjectId
  bookingID: Types.ObjectId
  medicalFacilityID: Types.ObjectId
  specialtyID?: Types.ObjectId
  diagnosis?: string
  medicines: MedicineItem[]
  totalPrice: number
}

export type RecordDocument = HydratedDocument<Record>
