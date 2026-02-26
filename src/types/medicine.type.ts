import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, QueryParams } from './base.type'

export interface Medicine extends BaseDocument {
  name: string
  medicalFacilityID: Types.ObjectId
  specialtyID: Types.ObjectId
  description?: string
  price: number
  stock: number
  status?: boolean
}

export interface MedicineQueryParams extends QueryParams {
  name?: string
}

export interface MedicineBody {
  name: string
  medicalFacilityID: string
  specialtyID: string
  description?: string
  price: number
  stock: number
  status?: boolean
}

export type MedicineDocument = HydratedDocument<Medicine>
