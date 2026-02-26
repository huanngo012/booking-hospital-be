import { BadRequestError, ForbiddenError, NotFoundError } from '~/core/error.response'
import { DoctorModel } from '~/models/Doctor'
import { MedicalFacilityModel } from '~/models/MedicalFacility'

const validateMedicalFacility = async (_id: string) => {
  const medicalFacilityExists = await MedicalFacilityModel.exists({ _id })
  if (!medicalFacilityExists) throw new BadRequestError('Cơ sở y tế không tồn tại')
}

const validateHostFacilityOwnership = async (hostID: string, currentFacilityId?: string) => {
  const existingFacility = await MedicalFacilityModel.exists({
    hostID,
    ...(currentFacilityId && {
      _id: { $ne: currentFacilityId }
    })
  })

  if (existingFacility) throw new BadRequestError('Host đã quản lý một cơ sở y tế khác')
}

const validateHostHasMedicalFacility = async (hostID: string) => {
  const facility = await MedicalFacilityModel.exists({
    hostID
  })

  if (!facility) throw new NotFoundError('Host chưa quản lý cơ sở y tế nào')
  return facility._id
}

const validateHostManageMedicalFacility = async (_id: string, hostID: string) => {
  const existingFacility = await MedicalFacilityModel.exists({
    _id,
    hostID
  })

  if (!existingFacility) throw new BadRequestError('Bạn không có quyền quản lý cơ sở y tế này')
}
const validateHostManageDoctor = async (doctorId: string, hostId: string) => {
  const doctor = await DoctorModel.findOne({
    _id: doctorId
  }).populate({
    path: 'medicalFacilityID',
    match: { hostID: hostId },
    select: '_id'
  })

  if (!doctor) throw new NotFoundError('Bác sĩ không tồn tại')

  if (!doctor.medicalFacilityID) throw new ForbiddenError('Bạn không có quyền quản lý bác sĩ này')
}

const validateSpecialtyBelongsToFacility = async (_id: string, specialtyID: string) => {
  const exists = await MedicalFacilityModel.exists({
    _id,
    specialtyID
  })

  if (!exists) {
    throw new BadRequestError('Chuyên khoa không thuộc cơ sở y tế này')
  }
}

export {
  validateHostFacilityOwnership,
  validateMedicalFacility,
  validateHostHasMedicalFacility,
  validateHostManageMedicalFacility,
  validateHostManageDoctor,
  validateSpecialtyBelongsToFacility
}
