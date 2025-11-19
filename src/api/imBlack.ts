import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'

/** 黑名单记录 */
export interface ImBlackItem {
  /** 主键 ID */
  id: string
  /** 类型：1=IP，2=UID */
  type: number
  /** 拉黑目标（IP 或 UID） */
  target: string
  /** 截止时间 */
  deadline: string
  /** 创建时间（继承自基础实体） */
  createTime?: string
  /** 用户昵称（仅当type=2时有值） */
  userName?: string
}

/** 黑名单分页查询参数 */
export interface ImBlackPageParams {
  /** 页面索引（从 1 开始） */
  pageNo: number
  /** 页面大小 */
  pageSize: number
  /** 拉黑类型：1=IP，2=UID */
  type?: number
  /** 拉黑目标（UID 或 IP） */
  target?: string
}

/** 黑名单分页返回 */
export interface ImBlackPageResp {
  /** 当前页数 */
  pageNo: number
  /** 每页数量 */
  pageSize: number
  /** 总记录数 */
  totalRecords: number
  /** 是否最后一页 */
  isLast?: boolean
  /** 数据列表 */
  list: ImBlackItem[]
}

/** 拉黑请求参数（支持IP和UID） */
export interface ImBlackReq {
  /** 类型：1=IP，2=UID */
  type: number
  /** 拉黑目标（IP 或 UID） */
  target: string
  /** 截止时间（分钟），0 表示永久拉黑 */
  deadline: number
}

/**
 * 黑名单分页查询
 */
export function getImBlackPage(params: ImBlackPageParams): Promise<ImBlackPageResp> {
  return request<ImBlackPageResp>({
    url: '/user/black/page',
    method: 'get',
    params,
    module: RequestModule.IM
  })
}

/**
 * 拉黑（支持IP和UID）
 */
export function addImBlack(data: ImBlackReq): Promise<void> {
  return request<void>({
    url: '/user/black',
    method: 'put',
    data,
    module: RequestModule.IM
  })
}
/** 编辑黑名单请求参数 */
export interface ImBlackEditReq {
  /** 黑名单记录 ID */
  id: string
  /** 类型：1=IP，2=UID */
  type: number
  /** 拉黑目标（IP 或 UID） */
  target: string
  /** 截止时间（yyyy-MM-dd HH:mm:ss格式），空字符串表示永久拉黑 */
  deadline: string
}

/**
 * 编辑黑名单
 */
export function editImBlack(data: ImBlackEditReq): Promise<void> {
  return request<void>({
    url: '/user/black/edit',
    method: 'post',
    data,
    module: RequestModule.IM
  })
}

/**
 * 移除黑名单
 */
export function removeImBlack(data: { id: string }): Promise<void> {
  return request<void>({
    url: '/user/black/remove',
    method: 'post',
    data,
    module: RequestModule.IM
  })
}
