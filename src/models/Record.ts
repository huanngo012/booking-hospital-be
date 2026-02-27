import { Schema, Types, model } from 'mongoose'
import { DosageTime, MedicineInstruction } from '~/constants/enums'
import { Record } from '~/types/record.type'

export const DOCUMENT_NAME = 'Record'
export const COLLECTION_NAME = 'records'

const schema = new Schema<Record>(
  {
    patientID: {
      type: Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true
    },

    doctorID: {
      type: Types.ObjectId,
      ref: 'Doctor',
      required: true
    },

    bookingID: {
      type: Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true
    },

    diagnosis: {
      type: String
    },

    medicines: [
      {
        _id: false,
        medicineID: {
          type: Types.ObjectId,
          ref: 'Medicine',
          required: true
        },
        instruction: {
          type: String,
          enum: Object.values(MedicineInstruction),
          required: true
        },
        dosage: {
          type: [String],
          enum: Object.values(DosageTime),
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

schema.index({ patientID: 1, createdAt: -1 })
schema.index({ medicalFacilityID: 1, createdAt: -1 })

export const RecordModel = model<Record>(DOCUMENT_NAME, schema, COLLECTION_NAME)
