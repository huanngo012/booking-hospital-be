import { Schema, Types, model } from 'mongoose'
import { InvoiceItemType, InvoiceStatus } from '~/constants/enums'
import { Invoice } from '~/types/invoice.type'

export const DOCUMENT_NAME = 'Invoice'
export const COLLECTION_NAME = 'invoices'

const schema = new Schema<Invoice>(
  {
    patientID: {
      type: Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true
    },

    bookingID: {
      type: Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true
    },

    recordID: {
      type: Types.ObjectId,
      ref: 'Record',
      required: true,
      unique: true
    },

    medicalFacilityID: {
      type: Types.ObjectId,
      ref: 'MedicalFacility',
      required: true,
      index: true
    },

    items: [
      {
        _id: false,
        type: {
          type: String,
          enum: Object.values(InvoiceItemType),
          required: true
        },
        refID: {
          type: Types.ObjectId
        },
        name: {
          type: String,
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
        },
        total: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.UNPAID,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)
export const InvoiceModel = model<Invoice>(DOCUMENT_NAME, schema, COLLECTION_NAME)
