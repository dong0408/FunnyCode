import type { ConsultType } from '@/enum'
import type {
  DoctorPage,
  FollowType,
  KnowledgeList,
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  TopDep,
  Image,
  ConsultOrderPreParams,
  ConsultOrderPreData,
  PartiaConsult,
  ConsultOrderItem,
  ConsultOrderPage,
  ConsultOrderParams
} from '@/types/consult'

import { request } from '@/utils/request'

//获取文章
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'GET', params)

export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('home/page/doc', 'GET', params)

export const followTarget = (id: string, type: FollowType = 'doc') =>
  request('like', 'POST', { id, type })

//查询科室

export const getAllDep = () => request<TopDep[]>('dep/all')

export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('upload', 'POST', fd)
}

//获取订单信息

export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request<ConsultOrderPreData>('/patient/consult/order/pre', 'GET', params)

//生成订单
export const createConsultOrder = (data: PartiaConsult) =>
  request<{ id: string }>('/patient/consult/order', 'POST', data)

//生成支付历史

export const getConsultOrderPayUrl = (data: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request<{ payUrl: string }>('/patient/consult/pay', 'POST', data)

//订单详情
export const getConsultOrderDetail = (orderId: string) =>
  request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', { orderId })

//查看处方

export const getPrescriptionPic = (id: string) =>
  request<{ url: string }>(`/patient/consult/prescription/${id}`)

//提交评价
export const evaluateConsultOrder = (data: {
  docId: string
  orderId: string
  score: number
  content: string
  anonymousFlag: 0 | 1
}) => request<{ id: string }>('/patient/order/evaluate', 'POST', data)

//问诊记录分页查询

export const getConsultOrderPage=(params:ConsultOrderParams)=>request<ConsultOrderPage>('/patient/consult/order/list', 'GET', params)

//取消订单

export  const  cancelOrder=(id:string)=>request(`/patient/order/cancel/${id}`,'PUT')

//删除订单

export  const  deleteOrder=(id:string)=>request(`/patient/order/${id}`,'DELETE')
