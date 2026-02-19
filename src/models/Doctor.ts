import { Schema, Types, model } from 'mongoose'
import { Gender } from '~/constants/enums'
import { Doctor } from '~/types/doctor.type'

export const DOCUMENT_NAME = 'Doctor'
export const COLLECTION_NAME = 'doctors'

const schema = new Schema<Doctor>(
  {
    _id: {
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
    clinicID: {
      type: Types.ObjectId,
      ref: 'Clinic'
    },
    description: {
      type: String
    },
    roomID: {
      type: String
    },
    position: {
      type: String
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
    }
  },
  {
    timestamps: true
  }
)

export const DoctorModel = model<Doctor>(DOCUMENT_NAME, schema, COLLECTION_NAME)
