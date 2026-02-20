import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ZodObject } from 'zod'

const validate =
  (schema: ZodObject, source: 'body' | 'params' | 'query'): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req[source])
      next()
    } catch (error) {
      next(error)
    }
  }

const validateRequestBody = (schema: ZodObject): RequestHandler => {
  return validate(schema, 'body')
}

const validateRequestParams = (schema: ZodObject): RequestHandler => {
  return validate(schema, 'params')
}

const validateRequestQuery = (schema: ZodObject): RequestHandler => {
  return validate(schema, 'query')
}

export { validateRequestBody, validateRequestParams, validateRequestQuery }
