import { HydratedDocument } from 'mongoose'
import { BaseDocument } from './base.type'

export interface Specialty extends BaseDocument {
  name: string
  nameNormalized: string
  description: string
  image: string
}

export type SpecialtyDocument = HydratedDocument<Specialty>
