import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, QueryParams } from './base.type'
import { Gender } from '~/constants/enums'

export interface Patient extends BaseDocument {
  name: string
  phone: string
  gender: Gender
  dob: Date
  bookedBy: Types.ObjectId
  nameNormalized: string
}

export interface PatientQueryParams extends QueryParams {
  name?: string
}

export interface PatientBody {
  name: string
  phone: string
  gender: Gender
  dob: Date
}

export type PatientDocument = HydratedDocument<Patient>
