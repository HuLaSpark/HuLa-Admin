import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { PageResponse, PageParams } from '@/types/api'

export interface OperationLogItem {
  id: string
  module?: string
  method?: string
  path?: string
  operator?: string
  status?: string
  ip?: string
  location?: string
  createTime?: string
}

export interface OperationLogQuery {
  requestIp?: string
  actionMethod?: string
  requestUri?: string
  httpMethod?: string
  type?: string
}

export function getOperationLogPage(params: PageParams & OperationLogQuery): Promise<PageResponse<OperationLogItem>> {
  const { pageNum, pageSize, requestIp, actionMethod, requestUri, httpMethod, type } = params as any
  return request<PageResponse<OperationLogItem>>({
    url: '/baseOperationLog/page',
    method: 'post',
    data: {
      model: { requestIp, actionMethod, requestUri, httpMethod, type },
      size: pageSize,
      current: pageNum
    },
    module: RequestModule.BASE
  })
}

export function clearOperationLog(type?: number): Promise<boolean> {
  return request<boolean>({
    url: '/baseOperationLog/clear',
    method: 'delete',
    params: { type },
    module: RequestModule.BASE
  })
}