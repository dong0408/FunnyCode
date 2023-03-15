// 1.axiso的配置
import router from '@/router'
import { useUserStore } from '@/stores'
import type { User } from '@/types/user'
import axios, { type Method } from 'axios'
import { showToast } from 'vant'

const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    //获取token,获取user
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (res) => {
    if (res.data.code !== 10000) {
      showToast(res.data.message || '网络异常')
      return Promise.reject(res.data)
    }

    return res.data
  },
  (err) => {
    //遇见401跳转登录
    if (err.response.status == 401) {
      const store = useUserStore()
      store.delUser()
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(err)
  }
)

type Data<T> = {
  code: string
  message: string
  data: T
}
const request = <T>(url: string, method: Method = 'get', submitData?: object) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    [method.toLocaleLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

// requset<User>('/user', 'get').then((res) => {
//   res.data.mobile
// })
export { baseURL, instance,request }
