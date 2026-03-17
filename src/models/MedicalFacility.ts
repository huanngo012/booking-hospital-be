import { Query, Schema, Types, model } from 'mongoose'
import slugify from 'slugify'
import { MedicalFacility, MedicalFacilityDocument } from '~/types/medical-facility.type'
import { removeVietnameseTones } from '~/utils/helpers'

export const DOCUMENT_NAME = 'MedicalFacility'
export const COLLECTION_NAME = 'medical_facilities'

const schema = new Schema<MedicalFacility>(
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
    logo: {
      type: String
    },
    address: {
      province: { type: String, default: '' },
      district: { type: String, default: '' },
      ward: { type: String, default: '' },
      detail: { type: String, default: '' }
    },
    images: [
      {
        type: String
      }
    ],
    description: {
      type: String
    },
    workingTimes: [
      {
        _id: false,
        dayOfWeek: {
          type: Number,
          required: true,
          min: 0,
          max: 6
        },
        startTime: {
          type: String,
          required: true
        },
        endTime: {
          type: String,
          required: true
        },
        breakTimes: [
          {
            _id: false,
            start: {
              type: String,
              required: true
            },
            end: {
              type: String,
              required: true
            }
          }
        ]
      }
    ],
    specialtyID: [{ type: Types.ObjectId, ref: 'Specialty' }],
    categoryID: { type: Types.ObjectId, ref: 'Category' },
    hostID: { type: Types.ObjectId, ref: 'User' },
    ratings: [
      {
        star: { type: Number },
        postedBy: { type: Types.ObjectId, ref: 'User' },
        comment: { type: String },
        updatedAt: { type: Date, default: Date.now }
      }
    ],
    totalRatings: {
      type: Number,
      default: 0
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
  { timestamps: true, versionKey: false }
)

schema.index({ deletedAt: 1 })
schema.index({ hostID: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } })
schema.index({ slug: 1 }, { unique: true, partialFilterExpression: { deletedAt: null } })
schema.index(
  { name: 1 },
  { unique: true, collation: { locale: 'vi', strength: 2 }, partialFilterExpression: { deletedAt: null } }
)

schema.pre(/^find|count/, function (this: Query<MedicalFacility, MedicalFacility>) {
  this.where({ deletedAt: null })
})

schema.pre('save', async function (this: MedicalFacilityDocument) {
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

export const MedicalFacilityModel = model<MedicalFacility>(DOCUMENT_NAME, schema, COLLECTION_NAME)
