import { BadRequestError } from '~/core/error.response'
import { DoctorModel } from '~/models/Doctor'

export const validateDoctorProfileExists = async (userID: string) => {
  const doctor = await DoctorModel.exists({
    userID
  })

  if (doctor) {
    throw new BadRequestError('Bác sĩ đã có hồ sơ')
  }
}
