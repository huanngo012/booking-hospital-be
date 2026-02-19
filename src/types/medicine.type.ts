import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument } from './base.type'

export interface Medicine extends BaseDocument {
  name: string
  medicalFacilityID: Types.ObjectId
  specialtyID?: Types.ObjectId
  description?: string
  price: number
  stock: number
  status?: boolean
}

export type MedicineDocument = HydratedDocument<Medicine>
