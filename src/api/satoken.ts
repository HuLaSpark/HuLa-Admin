import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { PageResponse, PageParams } from '@/types/api'

export interface OnlineUserItem {
  sessionId: string
  userId?: string
  username?: string
  nickName?: string
  ip?: string
  ua?: string
  createTime?: number | string
  lastActiveTime?: number | string
}

export interface TokenSignItem {
  tokenValue: string
  deviceId?: string | null
  deviceType?: string
  createTime?: number | string
  sessionTime?: number | string
  sessionStr?: string
  expireTime?: number | string
  expireStr?: string
  index?: number
  extraData?: any
}

export function getOnlineUsersPage(params: PageParams & { username?: string; nickName?: string; systemType?: number }): Promise<PageResponse<OnlineUserItem>> {
  return request<PageResponse<OnlineUserItem>>({
    url: '/defUser/onlineUsers/page',
    method: 'post',
    data: {
      model: { username: params.username, nickName: params.nickName, systemType: params.systemType },
      size: params.pageSize,
      current: params.pageNum
    },
    module: RequestModule.BASE
  })
}

export function getTokenSignListPage(params: { pageNum: number; pageSize: number; sessionId: string; systemType?: number }): Promise<PageResponse<TokenSignItem>> {
  return request<PageResponse<TokenSignItem>>({
    url: '/defUser/onlineUsers/getTokenSignList',
    method: 'post',
    data: {
      model: { sessionId: params.sessionId, systemType: params.systemType },
      size: params.pageSize,
      current: params.pageNum
    },
    module: RequestModule.BASE
  })
}

export function logoutUser(data: { token?: string; userId?: string; systemType?: number }): Promise<boolean> {
  return request<boolean>({
    url: '/defUser/onlineUsers/logout',
    method: 'post',
    params: data,
    module: RequestModule.BASE
  })
}

export function kickoutUser(data: { token?: string; userId?: string; systemType?: number }): Promise<boolean> {
  return request<boolean>({
    url: '/defUser/onlineUsers/kickout',
    method: 'post',
    params: data,
    module: RequestModule.BASE
  })
}

export function updateUserState(data: { id: string | number; state: boolean; systemType?: number }): Promise<boolean> {
  return request<boolean>({
    url: '/defUser/updateState',
    method: 'put',
    params: data,
    module: RequestModule.BASE
  })
}