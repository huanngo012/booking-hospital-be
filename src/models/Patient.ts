import { Schema, Types, model } from 'mongoose'
import { Gender } from '~/constants/enums'
import { Patient } from '~/types/patient.type'

export const DOCUMENT_NAME = 'Patient'
export const COLLECTION_NAME = 'patients'

const schema = new Schema<Patient>(
  {
    fullName: {
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
    clinicArr: [{ type: Types.ObjectId, ref: 'Clinic' }]
  },
  {
    timestamps: true
  }
)

export const PatientModel = model<Patient>(DOCUMENT_NAME, schema, COLLECTION_NAME)
