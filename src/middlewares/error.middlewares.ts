import createError, { HttpError } from 'http-errors'
import { NextFunction, Request, Response } from 'express'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(createError(404, `Route ${req.originalUrl} not found!`))
}

export const errHandler = (error: HttpError, req: Request, res: Response, _next: NextFunction) => {
  void _next
  const statusCode = error.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: error.message
  })
}
