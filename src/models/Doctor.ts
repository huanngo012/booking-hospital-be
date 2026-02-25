import { Query, Schema, Types, model } from 'mongoose'
import { Gender } from '~/constants/enums'
import { Doctor } from '~/types/doctor.type'

export const DOCUMENT_NAME = 'Doctor'
export const COLLECTION_NAME = 'doctors'

const schema = new Schema<Doctor>(
  {
    userID: {
      type: Types.ObjectId,
      ref: 'User'
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true
    },
    specialtyID: {
      type: Types.ObjectId,
      ref: 'Specialty'
    },
    medicalFacilityID: {
      type: Types.ObjectId,
      ref: 'MedicalFacility'
    },
    description: {
      type: String,
      default: ''
    },
    roomID: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: ''
    },
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
  {
    timestamps: true,
    versionKey: false
  }
)

schema.pre(/^find|count/, function (this: Query<Doctor, Doctor>) {
  this.where({ deletedAt: null })
})

schema.index({ deletedAt: 1 })

export const DoctorModel = model<Doctor>(DOCUMENT_NAME, schema, COLLECTION_NAME)
