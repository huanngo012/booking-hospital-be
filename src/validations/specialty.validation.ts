import { BadRequestError } from '~/core/error.response'
import { SpecialtyModel } from '~/models/Specialty'

const validateSpecialty = async (_id: string) => {
  const specialtyExists = await SpecialtyModel.exists({ _id })
  if (!specialtyExists) throw new BadRequestError('Chuyên khoa không tồn tại')
}

const validateSpecialties = async (ids: string[]) => {
  if (!ids?.length) return

  const existing = await SpecialtyModel.find({ _id: { $in: ids } }, { _id: 1 }).lean()

  const existingSet = new Set(existing.map((item) => item._id.toString()))

  const notFoundIds = ids.filter((id) => !existingSet.has(id))

  if (notFoundIds.length) {
    throw new BadRequestError(`Chuyên khoa không tồn tại: ${notFoundIds.join(', ')}`)
  }
}

export { validateSpecialties, validateSpecialty }
