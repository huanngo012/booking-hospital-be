import { RoleCode } from '~/constants/enums'
import { BadRequestError } from '~/core/error.response'
import { UserModel } from '~/models/User'

const validateDoctor = async (doctorID: string) => {
  const userExists = await UserModel.exists({
    _id: doctorID,
    role: RoleCode.DOCTOR
  })

  if (!userExists) throw new BadRequestError('Người dùng không phải bác sĩ')
}

export { validateDoctor }
