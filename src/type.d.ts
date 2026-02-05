import { Types } from 'mongoose'

export enum RoleCode {
  ADMIN = 'ADMIN',
  HOST = 'HOST',
  DOCTOR = 'DOCTOR',
  USER = 'USER'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum BookingStatus {
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  EXAMINED = 'EXAMINED',
  LEAVED = 'LEAVED'
}

export enum TimeSlotCode {
  SLOT_00_00 = '00:00',
  SLOT_00_30 = '00:30',

  SLOT_01_00 = '01:00',
  SLOT_01_30 = '01:30',

  SLOT_02_00 = '02:00',
  SLOT_02_30 = '02:30',

  SLOT_03_00 = '03:00',
  SLOT_03_30 = '03:30',

  SLOT_04_00 = '04:00',
  SLOT_04_30 = '04:30',

  SLOT_05_00 = '05:00',
  SLOT_05_30 = '05:30',

  SLOT_06_00 = '06:00',
  SLOT_06_30 = '06:30',

  SLOT_07_00 = '07:00',
  SLOT_07_30 = '07:30',

  SLOT_08_00 = '08:00',
  SLOT_08_30 = '08:30',

  SLOT_09_00 = '09:00',
  SLOT_09_30 = '09:30',

  SLOT_10_00 = '10:00',
  SLOT_10_30 = '10:30',

  SLOT_11_00 = '11:00',
  SLOT_11_30 = '11:30',

  SLOT_12_00 = '12:00',
  SLOT_12_30 = '12:30',

  SLOT_13_00 = '13:00',
  SLOT_13_30 = '13:30',

  SLOT_14_00 = '14:00',
  SLOT_14_30 = '14:30',

  SLOT_15_00 = '15:00',
  SLOT_15_30 = '15:30',

  SLOT_16_00 = '16:00',
  SLOT_16_30 = '16:30',

  SLOT_17_00 = '17:00',
  SLOT_17_30 = '17:30',

  SLOT_18_00 = '18:00',
  SLOT_18_30 = '18:30',

  SLOT_19_00 = '19:00',
  SLOT_19_30 = '19:30',

  SLOT_20_00 = '20:00',
  SLOT_20_30 = '20:30',

  SLOT_21_00 = '21:00',
  SLOT_21_30 = '21:30',

  SLOT_22_00 = '22:00',
  SLOT_22_30 = '22:30',

  SLOT_23_00 = '23:00',
  SLOT_23_30 = '23:30'
}

export enum MedicineInstruction {
  BEFORE = 'BEFORE',
  AFTER = 'AFTER'
}

export enum DosageTime {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING'
}

export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export enum InvoiceItemType {
  CONSULTATION = 'CONSULTATION',
  MEDICINE = 'MEDICINE',
  SERVICE = 'SERVICE'
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

export interface User {
  _id: Types.ObjectId
  fullName: string
  email: string
  password: string
  avatar?: string
  address: string
  role: string
  isBlocked: boolean
  refreshToken?: string
  isVerified: boolean
  emailToken?: string
  emailTokenExpires?: string
  passwordResetToken?: string
  passwordResetExpires?: string
}

export interface Patient {
  _id: Types.ObjectId
  fullName: string
  phone: string
  gender: string
  dob: Date
  bookedBy: Types.ObjectId
  clinicArr: Types.ObjectId[]
}
export interface Doctor {
  _id: Types.ObjectId
  gender: string
  specialtyID: Types.ObjectId
  clinicID: Types.ObjectId
  description?: string
  roomID?: string
  position?: string
  ratings: Rating[]
  totalRatings: number
}

export interface Category {
  _id: Types.ObjectId
  tag: string
}

export interface Specialty {
  _id: Types.ObjectId
  name: string
  description: string
  image: string
}

export interface MedicalFacility {
  _id: Types.ObjectId
  name: string
  logo?: string
  address: {
    province: string
    district: string
    ward: string
    detail: string
  }
  images?: string[]
  description?: string
  specialtyID: Types.ObjectId[]
  categoryID: Types.ObjectId
  hostID: Types.ObjectId
  ratings: Rating[]
  totalRatings: number
  workingTimes: FacilityWorkingTime[]
}

export interface Schedule {
  _id: Types.ObjectId
  doctorID: Types.ObjectId
  cost: number
  date: Date
  timeType: {
    time: string
    maxNumber: number
    full: boolean
  }[]
  isRemote: boolean
}

export interface TimeSlot {
  time: TimeSlotCode
  maxNumber: number
  bookedCount: number
}

export interface Schedule {
  _id: Types.ObjectId
  doctorID: Types.ObjectId
  cost: number
  date: Date
  timeSlots: TimeSlot[]
  isRemote: boolean
}

export interface Booking {
  _id: Types.ObjectId
  patientID: Types.ObjectId
  scheduleID: Types.ObjectId
  timeSlot: string
  description?: string
  descriptionImages?: string[]
  status: BookingStatus
  bookingFee?: number
  bookingPaid?: boolean
  qrCode?: string
  isPaid: boolean
}

export interface Medicine {
  _id: Types.ObjectId
  name: string
  medicalFacilityID: Types.ObjectId
  specialtyID?: Types.ObjectId
  description?: string
  price: number
  stock: number
  status?: boolean
}

export interface MedicineItem {
  medicineID: Types.ObjectId
  instruction: MedicineInstruction
  dosage: DosageTime[]
  quantity: number
  unitPrice: number
}

export interface Record {
  _id: Types.ObjectId
  patientID: Types.ObjectId
  doctorID: Types.ObjectId
  bookingID: Types.ObjectId
  medicalFacilityID: Types.ObjectId
  specialtyID?: Types.ObjectId
  diagnosis?: string
  medicines: MedicineItem[]
  totalPrice: number
}

export interface InvoiceItem {
  type: InvoiceItemType
  refID?: Types.ObjectId
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  _id: Types.ObjectId
  patientID: Types.ObjectId
  bookingID: Types.ObjectId
  recordID: Types.ObjectId
  medicalFacilityID: Types.ObjectId
  items: InvoiceItem[]
  totalAmount: number
  paidAmount: number
  status: InvoiceStatus
}
