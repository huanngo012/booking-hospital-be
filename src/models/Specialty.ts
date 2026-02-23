import { Query, Schema, model } from 'mongoose'
import slugify from 'slugify'
import { Specialty, SpecialtyDocument } from '~/types/specialty.type'
import { removeVietnameseTones } from '~/utils/helpers'

export const DOCUMENT_NAME = 'Specialty'
export const COLLECTION_NAME = 'specialties'

const schema = new Schema<Specialty>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    nameNormalized: {
      type: String,
      trim: true,
      select: false
    },
    description: {
      type: String
    },
    image: {
      type: String
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
  { name: 1 },
  { unique: true, collation: { locale: 'vi', strength: 2 }, partialFilterExpression: { deletedAt: null } }
)

schema.pre(/^find/, function (this: Query<Specialty, Specialty>) {
  this.where({ deletedAt: null })
})

schema.pre('save', async function (this: SpecialtyDocument) {
  if (this.isModified('name')) {
    this.nameNormalized = removeVietnameseTones(this.name)
  }
  if (this.isModified('name') || this.isModified('slug')) {
    let rawSlug: string
    if (this.isModified('slug') && this.slug) {
      rawSlug = this.slug
    } else {
      rawSlug = this.name
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

export const SpecialtyModel = model<Specialty>(DOCUMENT_NAME, schema, COLLECTION_NAME)
