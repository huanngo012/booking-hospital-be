import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, TimeSlot } from './base.type'

export interface Schedule extends BaseDocument {
  doctorID: Types.ObjectId
  cost: number
  date: Date
  timeSlots: TimeSlot[]
  isRemote: boolean
}

export type ScheduleDocument = HydratedDocument<Schedule>
