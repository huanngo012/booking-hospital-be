import { Schema, Types, model } from 'mongoose'
import { Medicine } from '~/type'

export const DOCUMENT_NAME = 'Medicine'
export const COLLECTION_NAME = 'medicines'

const schema = new Schema<Medicine>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    medicalFacilityID: {
      type: Types.ObjectId,
      ref: 'MedicalFacility',
      required: true,
      index: true
    },

    specialtyID: {
      type: Types.ObjectId,
      ref: 'Specialty'
    },

    description: {
      type: String
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    status: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

schema.index({ medicalFacilityID: 1, status: 1 })
schema.index({ name: 1, medicalFacilityID: 1 }, { unique: true })

export const MedicineModel = model<Medicine>(DOCUMENT_NAME, schema, COLLECTION_NAME)
