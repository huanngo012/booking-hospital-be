import { BadRequestError } from '~/core/error.response'
import { DoctorModel } from '~/models/Doctor'

const validateDoctor = async (_id: string) => {
  const doctorExists = await DoctorModel.exists({ _id })
  if (!doctorExists) throw new BadRequestError('Bác sĩ không tồn tại')
}

const validateDoctorProfileExists = async (userID: string) => {
  const doctor = await DoctorModel.exists({
    userID
  })

  if (doctor) {
    throw new BadRequestError('Bác sĩ đã có hồ sơ')
  }
}

const validateDoctorSlugExists = async (slug: string, currentDoctorId?: string) => {
  const doctor = await DoctorModel.exists({
    slug,
    ...(currentDoctorId && {
      _id: { $ne: currentDoctorId }
    })
  })

  if (doctor) {
    throw new BadRequestError('Slug bác sĩ đã tồn tại')
  }
}

export { validateDoctor, validateDoctorProfileExists, validateDoctorSlugExists }
