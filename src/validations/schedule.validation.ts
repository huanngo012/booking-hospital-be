import { BadRequestError } from '~/core/error.response'
import { ScheduleModel } from '~/models/Schedule'
import { TimeSlotInput } from '~/types/schedule.type'

const validateSchedule = async (_id: string) => {
  const patientExists = await ScheduleModel.exists({ _id })
  if (!patientExists) throw new BadRequestError('Lịch khám không tồn tại')
}

const validateTimeSlotInSchedule = async (_id: string, time: string) => {
  const exists = await ScheduleModel.exists({
    _id,
    'timeSlots.time': time
  })

  if (!exists) {
    throw new BadRequestError('Khung giờ không tồn tại trong lịch này')
  }
}

const validateDuplicateTime = (timeSlots: TimeSlotInput[]) => {
  const timeSet = new Set<string>()

  for (const slot of timeSlots) {
    if (timeSet.has(slot.time)) {
      throw new BadRequestError(`Trùng giờ ${slot.time}`)
    }
    timeSet.add(slot.time)
  }
}
export { validateSchedule, validateTimeSlotInSchedule, validateDuplicateTime }
