import { Query, Schema, Types, model } from 'mongoose'
import { Medicine, MedicineDocument } from '~/types/medicine.type'
import { removeVietnameseTones } from '~/utils/helpers'

export const DOCUMENT_NAME = 'Medicine'
export const COLLECTION_NAME = 'medicines'

const schema = new Schema<Medicine>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    medicalFacilityID: {
      type: Types.ObjectId,
      ref: 'MedicalFacility',
      required: true
    },

    specialtyID: {
      type: Types.ObjectId,
      ref: 'Specialty',
      required: true
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
      default: true
    },
    nameNormalized: {
      type: String,
      trim: true,
      select: false
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
schema.index(
  { name: 1, medicalFacilityID: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null }
  }
)

schema.pre(/^find|count/, function (this: Query<Medicine, Medicine>) {
  this.where({ deletedAt: null })
})

schema.pre('save', async function (this: MedicineDocument) {
  if (this.isModified('name')) {
    this.nameNormalized = removeVietnameseTones(this.name)
  }
})

export const MedicineModel = model<Medicine>(DOCUMENT_NAME, schema, COLLECTION_NAME)
