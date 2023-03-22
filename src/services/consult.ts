import type {
  DoctorPage,
  FollowType,
  KnowledgeList,
  KnowledgePage,
  KnowledgeParams,
  PageParams
} from '@/types/consult'
import { request } from '@/utils/request'

//获取文章
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'GET', params)

export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('home/page/doc', 'GET', params)

export const followTarget = (id: string, type: FollowType = 'doc') =>
  request('like', 'POST', { id, type })
