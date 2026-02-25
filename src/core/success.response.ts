import { Response } from 'express'
import { statusCodes } from '~/constants/status-codes'
import { Pagination } from '~/types/base.type'

class SuccessResponse<T> {
  status: number
  success: boolean
  data?: T
  pagination?: Pagination

  constructor({ status = statusCodes.OK, data, pagination }: { status?: number; data?: T; pagination?: Pagination }) {
    this.status = status
    this.success = true
    this.data = data
    this.pagination = pagination
  }
  send = (res: Response) => {
    return res.status(this.status).json(this)
  }
}
class OK<T> extends SuccessResponse<T> {
  constructor({ data, pagination }: { data: T; pagination?: Pagination }) {
    super({
      data,
      pagination
    })
  }
}

class CREATED<T> extends SuccessResponse<T> {
  constructor({ data }: { data: T }) {
    super({
      status: statusCodes.CREATED,
      data
    })
  }
}
class DELETED extends SuccessResponse<null> {
  constructor() {
    super({})
  }
}

export { OK, CREATED, DELETED, SuccessResponse }
