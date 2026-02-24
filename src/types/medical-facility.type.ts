import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, FacilityWorkingTime, Rating } from './base.type'

export interface MedicalFacility extends BaseDocument {
  name: string
  nameNormalized: string
  logo: string
  address: {
    province: string
    district: string
    ward: string
    detail: string
  }
  images: string[]
  description?: string
  specialtyID: Types.ObjectId[]
  categoryID: Types.ObjectId
  hostID: Types.ObjectId
  ratings: Rating[]
  totalRatings: number
  workingTimes: FacilityWorkingTime[]
}

export interface MedicalFacilityFiles {
  logo?: Express.Multer.File[]
  images?: Express.Multer.File[]
}
export type MedicalFacilityDocument = HydratedDocument<MedicalFacility>
