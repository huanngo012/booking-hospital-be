import createError, { HttpError } from 'http-errors'
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { statusCodes } from '~/constants/status-codes'
import { ErrorResponse } from '~/core/error.response'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(createError(404, `Route ${req.originalUrl} not found!`))
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  void _next
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: error.issues[0].message
    })
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    })
  }

  if (error instanceof ErrorResponse) {
    const status = error.status || statusCodes.INTERNAL_SERVER_ERROR
    const message = error.message || 'INTERNAL_SERVER_ERROR'
    return res.status(status).json({
      success: false,
      message: message
    })
  }
}
