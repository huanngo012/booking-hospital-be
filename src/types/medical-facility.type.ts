import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, FacilityWorkingTime, QueryParams, Rating } from './base.type'

export interface MedicalFacility extends BaseDocument {
  name: string
  nameNormalized?: string
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

export interface MedicalFacilityQueryParams extends QueryParams {
  name?: string
}

export interface MedicalFacilityBody {
  name: string
  address: {
    province: string
    district: string
    ward: string
    detail: string
  }
  description?: string
  specialtyID: string[]
  categoryID: string
  hostID: string
  workingTimes: FacilityWorkingTime[]
  logo?: string
  images?: string[]
  removeImageUrls?: string[]
  slug?: string
}

export type MedicalFacilityDocument = HydratedDocument<MedicalFacility>
