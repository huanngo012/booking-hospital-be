import { HydratedDocument } from 'mongoose'
import { BaseDocument, QueryParams } from './base.type'

export interface Category extends BaseDocument {
  tag: string
  tagNormalized: string
}

export interface CategoryQueryParams extends QueryParams {
  tag?: string
}

export interface CategoryBody {
  tag: string
  slug?: string
}
export type CategoryDocument = HydratedDocument<Category>
