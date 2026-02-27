import { Schema, Types, model } from 'mongoose'
import { BookingStatus } from '~/constants/enums'
import { Booking } from '~/types/booking.type'

export const DOCUMENT_NAME = 'Booking'
export const COLLECTION_NAME = 'bookings'

const schema = new Schema<Booking>(
  {
    patientID: {
      type: Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctorID: {
      type: Types.ObjectId,
      ref: 'Doctor',
      required: true
    },

    scheduleID: {
      type: Types.ObjectId,
      ref: 'Schedule',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    descriptionImages: [
      {
        type: String
      }
    ],

    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING
    },

    qrCode: {
      type: String
    },

    bookingFee: {
      type: Number,
      min: 0,
      default: 0
    },

    bookingPaid: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

schema.index(
  { patientID: 1, scheduleID: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
)

export const BookingModel = model<Booking>(DOCUMENT_NAME, schema, COLLECTION_NAME)
