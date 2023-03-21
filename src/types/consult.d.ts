export type KnowledgeType = 'like' | 'recommend' | 'fatReduction' | 'food'

//文章信息

export type Knowledge = {
  id: string
  /** 标题 */
  title: string
  /** 封面[] */
  coverUrl: string[]
  /** 标签[] */
  topics: string[]
  /** 收藏数 */
  collectionNumber: number
  /** 评论数 */
  commentNumber: number
  /** 医生名称 */
  creatorName: string
  /** 医生头像 */
  creatorAvatar: string
  /** 医生医院 */
  creatorHospatalName: string
  /** 关注文章 */
  likeFlag: 0 | 1
  /** 内容 */
  content: string
  /** 医生科室 */
  creatorDep: string
  /** 医生职称 */
  creatorTitles: string
  /** 医生ID */
  creatorId: string
}

//文章列表
export type KnowledgeList = Knowledge[]

//分页文章
export type KnowledgePage = {
  pageTotal: number
  total: number
  rows: KnowledgeList
}

//分页参数
export  type KnowledgeParams={
    type:KnowledgeType
    current:number
    pageSize:number
}
