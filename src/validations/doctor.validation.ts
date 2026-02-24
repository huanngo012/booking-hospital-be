import { BadRequestError } from '~/core/error.response'
import { DoctorModel } from '~/models/Doctor'

export const validateDoctorProfileExists = async (doctorID: string) => {
  const doctor = await DoctorModel.exists({
    _id: doctorID
  })

  if (doctor) {
    throw new BadRequestError('Bác sĩ đã có hồ sơ')
  }
}
