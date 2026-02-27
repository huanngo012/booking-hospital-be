import { Query, Schema, Types, model } from 'mongoose'
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
      immutable: true
    },

    date: {
      type: Date,
      required: true,
      immutable: true
    },

    cost: {
      type: Number,
      required: true,
      min: 0
    },

    timeSlots: [
      {
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
  { doctorID: 1, date: 1 },
  { unique: true, name: 'unique_doctor_schedule_per_day', partialFilterExpression: { deletedAt: null } }
)

schema.pre(/^find|count/, function (this: Query<Schedule, Schedule>) {
  this.where({ deletedAt: null })
})

export const ScheduleModel = model<Schedule>(DOCUMENT_NAME, schema, COLLECTION_NAME)
