import { Response } from 'express'
import { statusCodes } from '~/constants/status-codes'

class SuccessResponse<T = null> {
  status: number
  success: boolean
  data?: T | null

  constructor({ status = statusCodes.OK, data }: { status?: number; data?: T }) {
    this.status = status
    this.success = true
    this.data = data
  }
  send = (res: Response) => {
    return res.status(this.status).json(this)
  }
}
class OK<T> extends SuccessResponse<T> {
  constructor({ data }: { data: T }) {
    super({
      data
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
