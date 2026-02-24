import { Types } from 'mongoose'
import { DosageTime, InvoiceItemType, MedicineInstruction, TimeSlotCode } from '~/constants/enums'

export interface BaseDocument {
  _id: Types.ObjectId
  deletedAt?: Date | null
  slug?: string
}
export interface FacilityWorkingTime {
  dayOfWeek: number
  startTime: TimeSlotCode
  endTime: TimeSlotCode
  breakTimes?: {
    start: TimeSlotCode
    end: TimeSlotCode
  }[]
}
export interface Rating {
  star: number
  postedBy: Types.ObjectId
  comment?: string
  updatedAt: Date
}

export interface TimeSlot {
  time: TimeSlotCode
  maxNumber: number
  bookedCount: number
}

export interface MedicineItem {
  medicineID: Types.ObjectId
  instruction: MedicineInstruction
  dosage: DosageTime[]
  quantity: number
  unitPrice: number
}

export interface InvoiceItem {
  type: InvoiceItemType
  refID?: Types.ObjectId
  name: string
  quantity: number
  unitPrice: number
  total: number
}
