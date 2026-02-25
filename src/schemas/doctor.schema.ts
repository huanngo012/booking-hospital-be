import z from 'zod'
import { Gender } from '~/constants/enums'
import { objectIdSchema, requiredString } from './common.schema'

export const doctorBodySchema = z.object(
  {
    userID: objectIdSchema,
    gender: z.enum(Gender, {
      error: 'Vui lòng chọn giới tính'
    }),
    specialtyID: objectIdSchema,
    medicalFacilityID: objectIdSchema,
    slug: requiredString('slug không được để trống')
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
