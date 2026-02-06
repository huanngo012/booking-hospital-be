import createError from 'http-errors'
import { MongoServerError } from 'mongodb'

export const handleMongoDuplicateError = (error: unknown, message = 'Dữ liệu đã tồn tại'): never => {
  if (error instanceof MongoServerError && error.code === 11000) {
    throw createError(409, message)
  }
  throw error
}
