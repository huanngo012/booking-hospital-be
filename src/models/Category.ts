import { Query, Schema, model } from 'mongoose'
import { Category, CategoryDocument } from '~/types/category.type'
import { removeVietnameseTones } from '~/utils/helpers'

export const DOCUMENT_NAME = 'Category'
export const COLLECTION_NAME = 'categories'

const schema = new Schema<Category>(
  {
    tag: {
      type: String,
      required: true,
      trim: true
    },
    tag_normalized: {
      type: String,
      trim: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

schema.pre(/^find/, function (this: Query<Category, Category>) {
  this.where({ deletedAt: null })
})

schema.pre('save', function (this: CategoryDocument) {
  if (this.isModified('tag')) {
    this.tag_normalized = removeVietnameseTones(this.tag)
  }
})

schema.index({ deletedAt: 1 })
schema.index({ tag_normalized: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } })

export const CategoryModel = model<Category>(DOCUMENT_NAME, schema, COLLECTION_NAME)
