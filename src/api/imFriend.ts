import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'

/** 好友信息 */
export interface FriendItem {
  /** 好友UID */
  uid: string
  /** 备注名 */
  remark: string
  /** 在线状态：1=在线，2=离线 */
  activeStatus: number
  /** 不让TA看我 */
  hideMyPosts: boolean
  /** 不看TA */
  hideTheirPosts: boolean
  /** 好友用户名 */
  name: string
  /** 好友账号 */
  account: string
  /** 好友头像 */
  avatar: string
}

/** 游标分页请求 */
export interface CursorPageReq {
  /** 页面大小 */
  pageSize: number
  /** 游标（首次请求不传） */
  cursor?: string
}

/** 游标分页返回 */
export interface CursorPageResp<T> {
  /** 下一页游标 */
  cursor: string
  /** 是否最后一页 */
  isLast: boolean
  /** 数据列表 */
  list: T[]
}

/**
 * 获取用户的好友列表
 */
export function getFriendList(uid: string, params: CursorPageReq): Promise<CursorPageResp<FriendItem>> {
  return request<CursorPageResp<FriendItem>>({
    url: '/user/friend/page',
    method: 'get',
    params: {
      ...params,
      uid
    },
    module: RequestModule.IM
  })
}
