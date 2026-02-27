import { Query, Schema, Types, model } from 'mongoose'
import { Gender } from '~/constants/enums'
import { Patient, PatientDocument } from '~/types/patient.type'
import { removeVietnameseTones } from '~/utils/helpers'

export const DOCUMENT_NAME = 'Patient'
export const COLLECTION_NAME = 'patients'

const schema = new Schema<Patient>(
  {
    name: {
      type: String,
      required: true
    },
    nameNormalized: {
      type: String,
      trim: true,
      select: false
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

schema.pre('save', async function (this: PatientDocument) {
  if (this.isModified('name')) {
    this.nameNormalized = removeVietnameseTones(this.name)
  }
})

export const PatientModel = model<Patient>(DOCUMENT_NAME, schema, COLLECTION_NAME)
