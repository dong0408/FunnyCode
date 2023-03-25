import type { ConsultTime, ConsultType } from '@/enum'

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
// export type KnowledgeParams = {
//   type: KnowledgeType
//   current: number
//   pageSize: number
// }

// --------
// 通用的分页查询参数
export type PageParams = {
  /** 当前页码 */
  current: number
  /** 每页条数 */
  pageSize: number
}

// 文章列表查询参数
export type KnowledgeParams = PageParams & {
  /** 文章类型 */
  type: KnowledgeType
}

// 医生卡片对象
export type Doctor = {
  /** 医生ID */
  id: string
  /** 医生名称 */
  name: string
  /** 头像 */
  avatar: string
  /** 医院名称 */
  hospitalName: string
  /** 医院等级 */
  gradeName: string
  /** 科室 */
  depName: string
  /** 职称 */
  positionalTitles: string
  /** 是否关注，0 未关注 1 已关注 */
  likeFlag: 0 | 1
  /** 接诊服务费 */
  serviceFee: number
  /** 接诊人数 */
  consultationNum: number
  /** 评分 */
  score: number
  /** 主攻方向 */
  major: string
}

// 医生列表
export type DoctorList = Doctor[]

// 医生分页
export type DoctorPage = {
  pageTotal: number
  total: number
  rows: DoctorList
}

//关注的类型

export type FollowType = 'topic' | 'knowledge' | 'doc' | 'disease'

//问诊订单
export type Image = {
  id: string
  url: string
}

export type Consult = {
  type: ConsultType
  couponId: string
  illnessType: 0 | 1
  patientId: string
  depId: string
  illnessDesc: String
  illnessTime: ConsultTime
  consultFlag: 0 | 1
  pictures: Image[]
  id: string
}
//ts内置方法Partial，对象类型的属性全部转为partial
export type PartiaConsult = Partial<Consult>

// 二级科室

export type SubDep = {
  /** 科室ID */
  id: string
  /** 科室名称 */
  name: string
}

//一级科室

export type TopDep = SubDep & {
  /** 二级科室数组 */
  child: SubDep[]
}

export type ConsultIllness = Pick<
  PartiaConsult,
  'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
>
