import { z } from 'zod'
import { addressSchema, objectIdSchema, paramsSchema, querySchema, workingTimeSchema } from './common.schema'

const medicalFacilityNameSchema = z
  .string({ message: 'Vui lòng nhập đúng kiểu dữ liệu' })
  .trim()
  .min(1, 'Vui lòng nhập đầy đủ')
  .max(100, 'Tag tối đa 100 ký tự')

export const medicalFacilityBodySchema = z.object(
  {
    name: medicalFacilityNameSchema,
    logo: z.url('URL không hợp lệ').optional(),
    address: addressSchema,
    images: z.array(z.url('URL không hợp lệ')).optional(),
    description: z.string().optional(),
    specialtyID: z
      .array(objectIdSchema, { error: 'Phải chọn ít nhất 1 chuyên khoa' })
      .min(1, 'Phải chọn ít nhất 1 chuyên khoa'),
    categoryID: objectIdSchema,
    hostID: objectIdSchema,
    workingTimes: z
      .array(workingTimeSchema, { error: 'Phải chọn ít nhất 1 ngày làm việc' })
      .min(1, 'Phải có ít nhất 1 ngày làm việc')
  },
  {
    message: 'Vui lòng nhập dữ liệu'
  }
)
export const medicalFacilityQuerySchema = querySchema.extend({
  name: z.string().optional()
})

export type MedicalFacilityParams = z.infer<typeof paramsSchema>
export type MedicalFacilityBody = z.infer<typeof medicalFacilityBodySchema>
export type MedicalFacilityQuery = z.infer<typeof medicalFacilityQuerySchema>
