import type {
  DoctorPage,
  FollowType,
  KnowledgeList,
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  TopDep,
  Image
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
