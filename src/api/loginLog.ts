import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { PageResponse, PageParams } from '@/types/api'

export interface LoginLogItem {
  id: string
  username?: string
  uid?: string
  ip?: string
  location?: string
  isp?: string
  status?: string
  createTime?: string
}

export interface LoginLogQuery {
  requestIp?: string
  username?: string
  status?: string
}

export function getLoginLogPage(params: PageParams & LoginLogQuery): Promise<PageResponse<LoginLogItem>> {
  const { pageNum, pageSize, requestIp, username, status } = params as any
  return request<PageResponse<LoginLogItem>>({
    url: '/defLoginLog/page',
    method: 'post',
    data: {
      model: { requestIp, username, status },
      size: pageSize,
      current: pageNum
    },
    module: RequestModule.BASE
  })
}

export function clearLoginLog(type?: number): Promise<boolean> {
  return request<boolean>({
    url: '/defLoginLog/clear',
    method: 'delete',
    params: { type },
    module: RequestModule.BASE
  })
}