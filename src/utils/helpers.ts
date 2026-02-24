import createError from 'http-errors'
import { MongoServerError } from 'mongodb'

export const handleMongoDuplicateError = (error: unknown, message = 'Dữ liệu đã tồn tại'): never => {
  if (error instanceof MongoServerError && error.code === 11000) {
    throw createError(409, message)
  }
  throw error
}

export const removeVietnameseTones = (text: string = '') =>
  text
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()

export const extractPublicIdFromUrl = (url: string) => {
  try {
    const parts = url.split('/upload/')[1]

    const withoutVersion = parts.replace(/^v\d+\//, '')

    const publicId = withoutVersion.replace(/\.[^/.]+$/, '')

    return publicId
  } catch (error) {
    throw new Error('Invalid Cloudinary URL')
  }
}
