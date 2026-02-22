import { Query, Schema, Types, model } from 'mongoose'
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
      province: String,
      district: String,
      ward: String,
      detail: String
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
        updatedAt: { type: Date, default: Date.now() }
      }
    ],
    totalRatings: {
      type: Number,
      default: 0
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
schema.index({ hostID: 1 }, { unique: true })
schema.index(
  { name: 1 },
  { unique: true, collation: { locale: 'vi', strength: 2 }, partialFilterExpression: { deletedAt: null } }
)

schema.pre(/^find/, function (this: Query<MedicalFacility, MedicalFacility>) {
  this.where({ deletedAt: null })
})

schema.pre('save', function (this: MedicalFacilityDocument) {
  if (this.isModified('name')) {
    this.nameNormalized = removeVietnameseTones(this.name)
  }
})

export const MedicalFacilityModel = model<MedicalFacility>(DOCUMENT_NAME, schema, COLLECTION_NAME)
