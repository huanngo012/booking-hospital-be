import { HydratedDocument } from 'mongoose'
import { BaseDocument, QueryParams } from './base.type'

export interface Specialty extends BaseDocument {
  name: string
  nameNormalized: string
  description: string
  image: string
}

export interface SpecialtyQueryParams extends QueryParams {
  name?: string
}

export type SpecialtyDocument = HydratedDocument<Specialty>
