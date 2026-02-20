import { Query, Schema, model } from 'mongoose'
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
    name_normalized: {
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

schema.pre(/^find/, function (this: Query<Specialty, Specialty>) {
  this.where({ deletedAt: null })
})

schema.pre('save', function (this: SpecialtyDocument) {
  if (this.isModified('name')) {
    this.name_normalized = removeVietnameseTones(this.name)
  }
})

schema.index({ deletedAt: 1 })
schema.index(
  { name: 1 },
  { unique: true, collation: { locale: 'vi', strength: 2 }, partialFilterExpression: { deletedAt: null } }
)

export const SpecialtyModel = model<Specialty>(DOCUMENT_NAME, schema, COLLECTION_NAME)
