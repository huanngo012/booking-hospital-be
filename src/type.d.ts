import { Request } from 'express'

declare global {
  type BodyRequest<B> = Request<Record<string, never>, unknown, B>
  type ParamsRequest<P> = Request<P>
  type ParamsBodyRequest<P, B> = Request<P, unknown, B>
  type QueryRequest<Q> = Request<Record<string, never>, unknown, unknown, Q>
  type ParamsQueryRequest<P, Q> = Request<P, unknown, unknown, Q>
}
