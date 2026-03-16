import { RoleCode } from '~/constants/enums'
import { BadRequestError } from '~/core/error.response'
import { UserModel } from '~/models/User'

const validateEmailUnique = async (email: string) => {
  const emailExists = await UserModel.exists({ email })

  if (emailExists) {
    throw new BadRequestError('Email đã tồn tại')
  }
}

const validateUserRole = async (doctorID: string, role: RoleCode) => {
  const userExists = await UserModel.exists({
    _id: doctorID,
    role
  })

  if (!userExists) throw new BadRequestError('Người dùng không có quyền này')
}

export { validateEmailUnique, validateUserRole }
