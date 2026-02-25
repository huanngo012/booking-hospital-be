import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { mapError } from '~/utils/helpers'
import { NotFoundError } from '~/core/error.response'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found!`))
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  void _next
  const { status, message } = mapError(error)
  return res.status(status).json({
    success: false,
    message
  })
}
