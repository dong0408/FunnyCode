import type { AddressItem, OrderDetail, OrderPre } from '@/types/order'
import { request } from '@/utils/request'
import type { Logistics } from '@/types/order'
export const getMedicalOrderPre = (params: { prescriptionId: string }) =>
  request<OrderPre>('/patient/medicine/order/pre', 'GET', params)

export const getAddressList = () => request<AddressItem[]>('/patient/order/address', 'GET')

export const createMedicalOrder = (data: { id: string; couponId: string; addressId: string }) =>
  request<{ id: string }>('/patient/medicine/order', 'POST', data)

export const getMedicalOrderDetail = (id: string) =>
  request<OrderDetail>(`/patient/medicine/order/detail/${id}`)

// 获取药品订单物流信息
export const getMedicalOrderLogistics = (id: string) =>
  request<Logistics>(`/patient/order/${id}/logistics`)
