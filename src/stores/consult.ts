import type { ConsultType } from '@/enum'
import type { PartiaConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    //1.提供问诊记录的状态
    const consult = ref<PartiaConsult>({})

    // 2.修改问诊类型函数
    const setType = (type: ConsultType) => {
      consult.value.type = type
    }
    // 3修改极速问诊类型函数
    const setIllnessType = (type: 0 | 1) => {
      consult.value.illnessType = type
    }
    // 4.修改科室函数、
    const setDep = (id: string) => {
      consult.value.depId = id
    }
    // 5修改病情描述函数
    const setIllness = (
      illness: Pick<PartiaConsult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>
    ) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 6修改患者函数、
    const setPatient = (id: string) => {
      consult.value.patientId = id
    }

    //7修改优惠券函数
    const setCoupon = (id: string) => {
      consult.value.couponId = id
    }
    // 8清空函数
    const clear = () => {
      consult.value = {}
    }
    return { consult, setType, setIllnessType, setDep, setIllness, setPatient, setCoupon, clear }
  },
  {
    persist: true
  }
)
