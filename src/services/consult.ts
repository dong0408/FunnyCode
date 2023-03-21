import type { KnowledgeList, KnowledgePage, KnowledgeParams } from '@/types/consult'
import { request } from '@/utils/request'

//获取文章
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'GET', params)