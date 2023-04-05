import { timeOptions, flagOptions } from '@/services/constants'
// import { ConsultTime } from '@/enum'
import { ConsultTime } from '@/enum'

export const getIllnessTimeText = (time?: ConsultTime) => {
  return timeOptions.find((item) => item.value === time)?.label
}
export const getConsultFlagText = (flag?: 0 | 1) => {
  return flagOptions.find((item) => item.value === flag)?.label
}
