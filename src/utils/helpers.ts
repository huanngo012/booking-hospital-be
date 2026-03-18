import dayjs from 'dayjs'
import { MongoServerError } from 'mongodb'
import { ZodError } from 'zod'
import { statusCodes } from '~/constants/status-codes'
import { ErrorResponse } from '~/core/error.response'

export const removeVietnameseTones = (text: string = '') =>
  text
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()

export const normalizeDate = (date: Date | string) => {
  return dayjs(date).tz('Asia/Ho_Chi_Minh').startOf('day').toDate()
}
export const extractPublicIdFromUrl = (url: string) => {
  try {
    const parts = url.split('/upload/')[1]

    const withoutVersion = parts.replace(/^v\d+\//, '')

    const publicId = withoutVersion.replace(/\.[^/.]+$/, '')

    return publicId
  } catch {
    throw new Error('Invalid Cloudinary URL')
  }
}

export const mapError = (error: unknown) => {
  if (error instanceof ZodError) {
    return {
      status: statusCodes.BAD_REQUEST,
      message: error.issues[0]?.message
    }
  }

  if (error instanceof ErrorResponse) {
    return {
      status: error.status,
      message: error.message
    }
  }

  if (error instanceof MongoServerError) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      let message = `${field} đã tồn tại`
      if (error.message.includes('unique_doctor_schedule_per_day')) message = 'Bác sĩ đã có lịch trong ngày này'
      return {
        status: statusCodes.CONFLICT,
        message: message
      }
    }
    return {
      status: statusCodes.CONFLICT,
      message: error.message
    }
  }

  if (error instanceof Error) {
    return {
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message: error.message
    }
  }

  return {
    status: statusCodes.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error'
  }
}
