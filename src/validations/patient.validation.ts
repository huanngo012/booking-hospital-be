import { BadRequestError } from '~/core/error.response'
import { PatientModel } from '~/models/Patient'

const validatePatient = async (_id: string) => {
  const patientExists = await PatientModel.exists({ _id })
  if (!patientExists) throw new BadRequestError('Hồ sơ bệnh nhân không tồn tại')
}

const validateUserManagePatient = async (_id: string, userID: string) => {
  const existingFacility = await PatientModel.exists({
    _id,
    bookedBy: userID
  })

  if (!existingFacility) throw new BadRequestError('Bạn không có quyền đối với hồ sơ bệnh nhân này')
}

export { validatePatient, validateUserManagePatient }
