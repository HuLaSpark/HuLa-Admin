import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'

/**
 * 系统配置项
 */
export interface SysConfigItem {
  id: string
  configName: string
  type: string
  configKey: string
  configValue: string
  createTime?: string
  updateTime?: string
}

/**
 * 系统初始化配置
 */
export interface SystemInit {
  logo: string
  name: string
  roomGroupId: string
  qiNiu: {
    ossDomain: string
    fragmentSize: string
    turnSharSize: string
  }
}

/**
 * 配置查询参数
 */
export interface ConfigQueryParams {
  type?: string
  configName?: string
  configKey?: string
}

/**
 * 获取系统初始化配置
 */
export function getSystemInit(): Promise<SystemInit> {
  return request<SystemInit>({
    url: '/anyTenant/config/init',
    method: 'get',
    module: RequestModule.SYSTEM
  })
}

/**
 * 获取配置列表
 */
export function getConfigList(params?: ConfigQueryParams): Promise<SysConfigItem[]> {
  return request<SysConfigItem[]>({
    url: '/anyTenant/config/list',
    method: 'get',
    params,
    module: RequestModule.SYSTEM
  })
}

/**
 * 更新配置
 */
export function updateConfig(data: Partial<SysConfigItem>): Promise<boolean> {
  return request<boolean>({
    url: '/anyTenant/config/update',
    method: 'put',
    data,
    module: RequestModule.SYSTEM
  })
}

/**
 * 批量更新配置
 */
export function batchUpdateConfig(data: Partial<SysConfigItem>[]): Promise<boolean> {
  return request<boolean>({
    url: '/anyTenant/config/batchUpdate',
    method: 'put',
    data,
    module: RequestModule.SYSTEM
  })
}

