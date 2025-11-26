import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { PageResponse, PageParams } from '@/types/api'

export interface OrgItem {
  id: string
  orgName: string
  code?: string
  parentId?: string
  sort?: number
  state?: boolean
  createTime?: string
  updateTime?: string
}

export function getOrgPage(params: PageParams & { keyword?: string }): Promise<PageResponse<OrgItem>> {
  return request<PageResponse<OrgItem>>({
    url: '/baseOrg/page',
    method: 'post',
    data: {
      model: { orgName: params.keyword, name: params.keyword },
      size: params.pageSize,
      current: params.pageNum
    },
    module: RequestModule.BASE
  })
}