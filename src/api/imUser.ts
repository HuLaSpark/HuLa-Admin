import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'

/** IM用户信息 - 对应后端 UserSearchResp */
export interface ImUser {
  /** 用户UID */
  uid: string
  /** 用户名 */
  name: string
  /** 账号 */
  account: string
  /** 头像 */
  avatar: string
}

/** IM用户搜索参数 */
export interface ImUserSearchParams {
  /** 页面索引（从1开始） */
  pageNo: number
  /** 页面大小 */
  pageSize: number
  /** 搜索关键词（昵称模糊查询） */
  keyword?: string
  /** 用户ID（精确查询，用于回显） */
  id?: string
}

/** IM用户搜索返回 */
export interface ImUserSearchResp {
  /** 当前页数 */
  pageNo: number
  /** 每页数量 */
  pageSize: number
  /** 总记录数 */
  totalRecords: number
  /** 是否最后一页 */
  isLast?: boolean
  /** 数据列表 */
  list: ImUser[]
}

/**
 * 搜索IM用户（按昵称模糊查询）
 */
export function searchImUser(params: ImUserSearchParams): Promise<ImUserSearchResp> {
  return request<ImUserSearchResp>({
    url: '/user/search',
    method: 'get',
    params,
    module: RequestModule.IM
  })
}
