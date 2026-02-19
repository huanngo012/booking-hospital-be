import { Schema, Types, model } from 'mongoose'
import { TimeSlotCode } from '~/constants/enums'
import { Schedule } from '~/types/schedule.type'

export const DOCUMENT_NAME = 'Schedule'
export const COLLECTION_NAME = 'schedules'

const schema = new Schema<Schedule>(
  {
    doctorID: {
      type: Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true
    },

    date: {
      type: Date,
      required: true
    },

    cost: {
      type: Number,
      required: true
    },

    timeSlots: [
      {
        _id: false,
        time: {
          type: String,
          enum: Object.values(TimeSlotCode),
          required: true
        },
        maxNumber: {
          type: Number,
          default: 3
        },
        bookedCount: {
          type: Number,
          default: 0
        }
      }
    ],

    isRemote: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

export const ScheduleModel = model<Schedule>(DOCUMENT_NAME, schema, COLLECTION_NAME)
