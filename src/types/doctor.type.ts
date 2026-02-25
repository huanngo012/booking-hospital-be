import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, QueryParams, Rating } from './base.type'
import { Gender } from '~/constants/enums'

export interface Doctor extends BaseDocument {
  userID: Types.ObjectId
  gender: Gender
  specialtyID: Types.ObjectId
  medicalFacilityID: Types.ObjectId
  description?: string
  roomID?: string
  position?: string
  ratings?: Rating[]
  totalRatings?: number
}

export interface DoctorQueryParams extends QueryParams {
  name?: string
  specialtyID?: string
  medicalFacilityID?: string
}

export interface DoctorBody {
  userID: string
  gender: Gender
  specialtyID: string
  medicalFacilityID: string
  description?: string
  roomID?: string
  position?: string
  slug: string
}

export type DoctorDocument = HydratedDocument<Doctor>
