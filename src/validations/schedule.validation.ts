import { BadRequestError } from '~/core/error.response'
import { TimeSlotInput } from '~/types/schedule.type'

const validateDuplicateTime = (timeSlots: TimeSlotInput[]) => {
  const timeSet = new Set<string>()

  for (const slot of timeSlots) {
    if (timeSet.has(slot.time)) {
      throw new BadRequestError(`Trùng giờ ${slot.time}`)
    }
    timeSet.add(slot.time)
  }
}
export { validateDuplicateTime }
