import type { codeType, User } from '@/types/user'
import { request } from '@/utils/request'

export const loginByPassword = (mobile: string, password: string) =>
  request<User>('/login/password', 'POST', { mobile, password })
//<User>代表返回数据类型
export const sendMobileCode = (mobile: string, type: codeType) => {
  request('code', 'GET', { mobile, type })
}
