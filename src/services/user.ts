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

//添加患者
export const addPatient = (patient: Patient) =>
  request<{ id: string }>('patient/add', 'POST', patient)

// export const akl =(data:data)=>request<{id:string}>(''user/id','POSt'，data)
//这个括号里的代表需要传入的参数，在之后面使用，<{id:string}>代表返回的参数，

//编辑患者
export const updatePatient = (patient: Patient) =>
  request<{ id: string }>('patient/add', 'POST', patient)

//删除患者
export const deletePatient = (id: string) => request(`patient/del/${id}`, 'DELETE')
