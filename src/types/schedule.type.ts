import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, QueryParams, TimeSlot } from './base.type'

export interface Schedule extends BaseDocument {
  doctorID: Types.ObjectId
  cost: number
  date: Date
  timeSlots: TimeSlot[]
  isRemote: boolean
}

export interface ScheduleQueryParams extends QueryParams {
  date?: string
}

export interface ScheduleBody {
  doctorID: string
  cost: number
  date: Date
  timeSlots: TimeSlot[]
  isRemote?: boolean
}

export type ScheduleDocument = HydratedDocument<Schedule>
