import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { PageResponse, PageParams } from '@/types/api'

export interface PositionItem {
  id: string
  name: string
  code?: string
  sort?: number
  state?: boolean
  createTime?: string
  updateTime?: string
}

export function getPositionPage(params: PageParams & { keyword?: string }): Promise<PageResponse<PositionItem>> {
  return request<PageResponse<PositionItem>>({
    url: '/basePosition/page',
    method: 'post',
    data: {
      model: { name: params.keyword, code: params.keyword },
      size: params.pageSize,
      current: params.pageNum
    },
    module: RequestModule.BASE
  })
}