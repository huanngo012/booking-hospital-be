import { BadRequestError } from '~/core/error.response'
import { SpecialtyModel } from '~/models/Specialty'

const validateSpecialty = async (_id: string) => {
  const specialtyExists = await SpecialtyModel.exists({ _id })
  if (!specialtyExists) throw new BadRequestError('Chuyên khoa không tồn tại')
}

const validateSpecialties = async (ids: string[]) => {
  if (!ids?.length) return

  const count = await SpecialtyModel.countDocuments({
    _id: { $in: ids }
  })

  if (count !== ids.length) throw new BadRequestError('Có chuyên khoa không tồn tại')
}

export { validateSpecialties, validateSpecialty }
