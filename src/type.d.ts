import { Request } from 'express'
import { User } from './types/user.type'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
  type BodyRequest<B> = Request<Record<string, never>, unknown, B>
  type ParamsRequest<P> = Request<P>
  type ParamsBodyRequest<P, B> = Request<P, unknown, B>
  type QueryRequest<Q> = Request<Record<string, never>, unknown, unknown, Q>
  type ParamsQueryRequest<P, Q> = Request<P, unknown, unknown, Q>
}
