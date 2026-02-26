import { HydratedDocument, Types } from 'mongoose'
import { BaseDocument, QueryParams, TimeSlot } from './base.type'
import { TimeSlotCode } from '~/constants/enums'

export interface Schedule extends BaseDocument {
  doctorID: Types.ObjectId
  cost: number
  date: Date
  timeSlots: Types.DocumentArray<TimeSlot>
  isRemote: boolean
}

export interface ScheduleQueryParams extends QueryParams {
  doctorID?: string
  date?: string
}

export interface TimeSlotInput {
  _id?: string
  time: TimeSlotCode
  maxNumber: number
}

export interface ScheduleBody {
  doctorID: string
  cost: number
  date: Date
  timeSlots: TimeSlotInput[]
  isRemote?: boolean
}

export type ScheduleDocument = HydratedDocument<Schedule>
