import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument } from './base.type'

export interface Patient extends BaseDocument {
  fullName: string
  phone: string
  gender: string
  dob: Date
  bookedBy: Types.ObjectId
  clinicArr: Types.ObjectId[]
}

export type PatientDocument = HydratedDocument<Patient>
