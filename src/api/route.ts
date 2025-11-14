import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { RouteItem, UserRoutesResponse, ResourceTreeNode } from '@/types/api'

/**
 * 获取公共路由
 * @param applicationId 应用 ID
 */
export function getConstantRoutesApi(applicationId: number = 1): Promise<RouteItem[]> {
  return request<RouteItem[]>({
    url: '/anyTenant/menu/initRoute',
    method: 'get',
    params: { applicationId },
    module: RequestModule.OAUTH,
    needToken: false
  })
}

/**
 * 获取用户路由（需要登录）
 * @param applicationId 应用 ID
 */
export function getUserRoutesApi(applicationId: number = 1): Promise<UserRoutesResponse> {
  return request<UserRoutesResponse>({
    url: '/anyone/visible/resource',
    method: 'get',
    params: { applicationId },
    module: RequestModule.OAUTH
  })
}

/**
 * 检查路由是否存在
 * @param routeName 路由名称
 */
export function checkRouteExistApi(routeName: string): Promise<boolean> {
  return request<boolean>({
    url: '/defResource/isRouteExist',
    method: 'get',
    params: { routeName },
    module: RequestModule.BASE
  })
}

/**
 * 获取资源树（用于菜单管理）
 * @param applicationId 应用 ID
 */
export function getResourceTreeApi(applicationId: number = 1): Promise<ResourceTreeNode[]> {
  return request<ResourceTreeNode[]>({
    url: '/defResource/tree',
    method: 'post',
    params: { applicationId },
    module: RequestModule.BASE
  })
}

/**
 * 获取可见资源（菜单 + 视图）
 * @param applicationId 应用 ID
 */
export function getVisibleResourceApi(applicationId: number = 1): Promise<RouteItem[]> {
  return request<RouteItem[]>({
    url: '/defResource/visible',
    method: 'get',
    params: { applicationId },
    module: RequestModule.BASE
  })
}

/**
 * 新增资源
 * @param data 资源数据
 */
export function addResourceApi(data: Partial<ResourceTreeNode>): Promise<void> {
  return request<void>({
    url: '/defResource/add',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}

/**
 * 编辑资源
 * @param data 资源数据
 */
export function editResourceApi(data: Partial<ResourceTreeNode>): Promise<void> {
  return request<void>({
    url: '/defResource/edit',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}

/**
 * 删除资源
 * @param data 删除参数
 */
export function deleteResourceApi(data: { id?: string; ids?: string[] }): Promise<void> {
  return request<void>({
    url: '/defResource/del',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}

/**
 * 获取资源详情
 * @param id 资源 ID
 */
export function getResourceDetailApi(id: string): Promise<ResourceTreeNode> {
  return request<ResourceTreeNode>({
    url: '/defResource/detail',
    method: 'get',
    params: { id },
    module: RequestModule.BASE
  })
}

