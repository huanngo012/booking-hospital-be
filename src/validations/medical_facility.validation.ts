import { RoleCode } from '~/constants/enums'
import { BadRequestError } from '~/core/error.response'
import { CategoryModel } from '~/models/Category'
import { MedicalFacilityModel } from '~/models/MedicalFacility'
import { SpecialtyModel } from '~/models/Specialty'
import { UserModel } from '~/models/User'

const validateHost = async (hostID: string, currentFacilityId?: string) => {
  const user = await UserModel.findOne({
    _id: hostID,
    role: RoleCode.HOST
  })

  if (!user) throw new BadRequestError('Host không hợp lệ')

  const existingFacility = await MedicalFacilityModel.exists({
    hostID,
    ...(currentFacilityId && {
      _id: { $ne: currentFacilityId }
    })
  })

  if (existingFacility) throw new BadRequestError('Host đã quản lý một cơ sở y tế khác')
}

const validateCategory = async (_id: string) => {
  const categoryExists = await CategoryModel.exists({ _id })
  if (!categoryExists) throw new BadRequestError('Danh mục không tồn tại')
}

const validateSpecialties = async (ids: string[]) => {
  if (!ids?.length) return

  const count = await SpecialtyModel.countDocuments({
    _id: { $in: ids }
  })

  if (count !== ids.length) throw new BadRequestError('Có chuyên khoa không tồn tại')
}

const validateMedicalFacility = async (_id: string) => {
  const medicalFacilityExists = await MedicalFacilityModel.exists({ _id })
  if (!medicalFacilityExists) throw new BadRequestError('Cơ sở y tế không tồn tại')
}
const validateSpecialty = async (_id: string) => {
  const specialtyExists = await SpecialtyModel.exists({ _id })
  if (!specialtyExists) throw new BadRequestError('Chuyên khoa không tồn tại')
}

export { validateHost, validateCategory, validateSpecialties, validateMedicalFacility, validateSpecialty }
