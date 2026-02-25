import { z } from 'zod'
import { addressSchema, objectIdSchema, workingTimeSchema } from './common.schema'

const medicalFacilityNameSchema = z
  .string({ message: 'Vui lòng nhập đúng kiểu dữ liệu' })
  .trim()
  .min(1, 'Vui lòng nhập đầy đủ')
  .max(100, 'Tag tối đa 100 ký tự')

export const medicalFacilityBodySchema = z.object(
  {
    name: medicalFacilityNameSchema,
    address: addressSchema,
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
