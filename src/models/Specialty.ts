import { Schema, model } from 'mongoose'
import { Specialty } from '~/types/specialty.type'

export const DOCUMENT_NAME = 'Specialty'
export const COLLECTION_NAME = 'specialties'

const schema = new Schema<Specialty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    description: {
      type: String
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export const SpecialtyModel = model<Specialty>(DOCUMENT_NAME, schema, COLLECTION_NAME)
