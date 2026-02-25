import z from 'zod'
import { Gender } from '~/constants/enums'
import { objectIdSchema, querySchema } from './common.schema'

export const doctorBodySchema = z.object(
  {
    userID: objectIdSchema,
    gender: z.enum(Gender, {
      error: 'Vui lòng chọn giới tính'
    }),
    specialtyID: objectIdSchema,
    medicalFacilityID: objectIdSchema
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)

export const doctorQuerySchema = querySchema.extend({
  name: z.string().optional()
})

export type DoctorQuery = z.infer<typeof doctorQuerySchema>
