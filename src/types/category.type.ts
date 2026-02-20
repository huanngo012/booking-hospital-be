import { HydratedDocument } from 'mongoose'
import { BaseDocument } from './base.type'

export interface Category extends BaseDocument {
  tag: string
  tagNormalized: string
}

export type CategoryDocument = HydratedDocument<Category>
