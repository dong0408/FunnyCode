import type { codeType, Patient, PatientList, User, UserInfo } from '@/types/user'
import { request } from '@/utils/request'

export const loginByPassword = (mobile: string, password: string) =>
  request<User>('/login/password', 'POST', { mobile, password })
//<User>代表返回数据类型
export const sendMobileCode = (mobile: string, type: codeType) => {
  request('code', 'GET', { mobile, type })
}

export const loginByCode = (mobile: string, code: string) =>
  request<User>('/login', 'POST', { mobile, code })

export const getUserInfo = () => request<UserInfo>('patient/myUser')

export const getPatientList = () => request<PatientList>('patient/mylist')
