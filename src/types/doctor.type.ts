import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, Rating } from './base.type'

export interface Doctor extends BaseDocument {
  userID: Types.ObjectId
  gender: string
  specialtyID: Types.ObjectId
  medicalFacilityID: Types.ObjectId
  description?: string
  roomID?: string
  position?: string
  ratings?: Rating[]
  totalRatings?: number
}

export type DoctorDocument = HydratedDocument<Doctor>
