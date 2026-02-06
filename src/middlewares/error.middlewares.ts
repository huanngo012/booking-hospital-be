import createError, { HttpError } from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(createError(404, `Route ${req.originalUrl} not found!`))
}

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
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

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}
