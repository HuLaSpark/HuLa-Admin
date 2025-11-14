import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { TenantInfo } from '@/types/api'

/**
 * 获取所有正常状态的租户列表
 * 需要登录后调用
 */
export function getTenantListApi(): Promise<TenantInfo[]> {
  return request<TenantInfo[]>({
    url: '/defTenant/all',
    method: 'get',
    module: RequestModule.BASE
  })
}

/**
 * 获取用户的可用租户列表
 * 需要登录后调用
 * 后端会从 token 中解析 userId，无需前端传递
 */
export function getUserTenantListApi(): Promise<TenantInfo[]> {
  return request<TenantInfo[]>({
    url: `/defTenant/listTenantByUserId`,
    method: 'get',
    module: RequestModule.BASE
  })
}

/**
 * 检测租户编码是否存在
 * @param code 租户编码
 */
export function checkTenantCodeApi(code: string): Promise<boolean> {
  return request<boolean>({
    url: `/defTenant/check/${code}`,
    method: 'get',
    module: RequestModule.BASE
  })
}

/**
 * 获取租户详情
 * @param id 租户 ID
 */
export function getTenantDetailApi(id: string): Promise<TenantInfo> {
  return request<TenantInfo>({
    url: `/defTenant/detail`,
    method: 'get',
    params: { id },
    module: RequestModule.BASE
  })
}

