import { Query, Schema, model } from 'mongoose'
import slugify from 'slugify'
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
    tagNormalized: {
      type: String,
      trim: true,
      select: false
    },
    slug: {
      type: String,
      trim: true
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

schema.index({ deletedAt: 1 })
schema.index({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } })
schema.index(
  { tag: 1 },
  { unique: true, collation: { locale: 'vi', strength: 2 }, partialFilterExpression: { deletedAt: null } }
)

schema.pre(/^find/, function (this: Query<Category, Category>) {
  this.where({ deletedAt: null })
})

schema.pre('save', async function (this: CategoryDocument) {
  if (this.isModified('tag')) {
    this.tagNormalized = removeVietnameseTones(this.tag)
  }
  if (this.isModified('tag') || this.isModified('slug')) {
    let rawSlug: string
    if (this.isModified('slug') && this.slug) {
      rawSlug = this.slug
    } else {
      rawSlug = this.tag
    }
    const baseSlug = slugify(rawSlug, {
      lower: true,
      strict: true,
      locale: 'vi'
    })
    const count = await this.model(DOCUMENT_NAME).countDocuments({
      slug: baseSlug
    })
    this.slug = count > 0 ? `${baseSlug}-${count}` : baseSlug
  }
})

export const CategoryModel = model<Category>(DOCUMENT_NAME, schema, COLLECTION_NAME)
