import { Query, Schema, model } from 'mongoose'
import { Category } from '~/type'

export const DOCUMENT_NAME = 'Category'
export const COLLECTION_NAME = 'categories'

const schema = new Schema<Category>(
  {
    tag: {
      type: String,
      required: true,
      trim: true
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
)

schema.pre(/^find/, function (this: Query<Category, Category>) {
  this.where({ deletedAt: null })
})
schema.index({ tag: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } })

export const CategoryModel = model<Category>(DOCUMENT_NAME, schema, COLLECTION_NAME)
