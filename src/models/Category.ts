import { Schema, model } from 'mongoose'
import { Category } from '~/type'

export const DOCUMENT_NAME = 'Category'
export const COLLECTION_NAME = 'categories'

const schema = new Schema<Category>(
  {
    tag: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  {
    timestamps: true
  }
)

export const CategoryModel = model<Category>(DOCUMENT_NAME, schema, COLLECTION_NAME)
