import { Query, Schema, Types, model } from 'mongoose'
import { Gender } from '~/constants/enums'
import { Patient } from '~/types/patient.type'

export const DOCUMENT_NAME = 'Patient'
export const COLLECTION_NAME = 'patients'

const schema = new Schema<Patient>(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    bookedBy: { type: Types.ObjectId, ref: 'User' },
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

schema.pre(/^find|count/, function (this: Query<Patient, Patient>) {
  this.where({ deletedAt: null })
})

export const PatientModel = model<Patient>(DOCUMENT_NAME, schema, COLLECTION_NAME)
