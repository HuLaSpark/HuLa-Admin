import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'

export interface ApiKeyItem {
  id?: string
  name: string
  apiKey: string
  platform: string
  url?: string
  status: number
  publicStatus?: boolean
}

export interface ApiKeyPageParams {
  pageNo: number
  pageSize: number
  name?: string
  platform?: string
  status?: number
}

export interface ModelItem {
  id?: string
  keyId?: string
  name: string
  avatar?: string
  model: string
  platform: string
  type: number
  sort?: number
  status: number
  temperature?: number
  maxTokens?: number
  maxContexts?: number
  publicStatus?: number
  supportsReasoning?: boolean
}

export interface ModelPageParams {
  pageNo: number
  pageSize: number
  name?: string
  model?: string
  platform?: string
  publicStatus?: number
}

export interface PageResult<T> {
  list: T[]
  total: number
}

export interface PlatformItem {
  platform: string
  label: string
  docs?: string
  hint?: string
  sort: number
  status: number
}

export interface ApiKeySimpleItem {
  id: string
  name: string
  platform: string
}

export interface ApiKeyBalanceInfo {
  currency: string
  totalBalance: number
  grantedBalance?: number
  toppedUpBalance?: number
  available?: boolean
  usageTotal?: number
}

export interface ApiKeyBalanceResp {
  id: string
  platform: string
  supported: boolean
  success: boolean
  errorMessage?: string
  balanceInfos: ApiKeyBalanceInfo[]
  totalBalance: number
}

export function getPlatformList(): Promise<PlatformItem[]> {
  return request<PlatformItem[]>({
    url: '/platform/list',
    method: 'get',
    module: RequestModule.AI
  })
}

export function getApiKeySimpleList(): Promise<ApiKeySimpleItem[]> {
  return request<ApiKeySimpleItem[]>({
    url: '/api-key/admin/all-list',
    method: 'get',
    module: RequestModule.AI
  })
}

export function getApiKeyAdminPage(params: ApiKeyPageParams): Promise<PageResult<ApiKeyItem>> {
  return request<PageResult<ApiKeyItem>>({
    url: '/api-key/admin/page',
    method: 'get',
    params,
    module: RequestModule.AI
  })
}

export function getApiKeyBalance(id: string): Promise<ApiKeyBalanceResp> {
  return request<ApiKeyBalanceResp>({
    url: '/api-key/balance',
    method: 'get',
    params: { id },
    module: RequestModule.AI
  })
}

export function getModelSimpleList(): Promise<ApiKeySimpleItem[]> {
  return request<ApiKeySimpleItem[]>({
    url: '/model/admin/all-list',
    method: 'get',
    module: RequestModule.AI
  })
}

export function getApiKeyPage(params: ApiKeyPageParams): Promise<PageResult<ApiKeyItem>> {
  return request<PageResult<ApiKeyItem>>({
    url: '/api-key/simple-list',
    method: 'get',
    params,
    module: RequestModule.AI
  })
}

export function createApiKey(data: ApiKeyItem): Promise<string> {
  return request<string>({
    url: '/api-key/create',
    method: 'post',
    data,
    module: RequestModule.AI
  })
}

export function updateApiKey(data: ApiKeyItem): Promise<boolean> {
  return request<boolean>({
    url: '/api-key/update',
    method: 'put',
    data,
    module: RequestModule.AI
  })
}

export function deleteApiKey(id: string): Promise<boolean> {
  return request<boolean>({
    url: '/api-key/delete',
    method: 'delete',
    params: { id },
    module: RequestModule.AI
  })
}

// 管理员专用接口
export function updateApiKeyAdmin(data: ApiKeyItem): Promise<boolean> {
  return request<boolean>({
    url: '/api-key/admin/update',
    method: 'put',
    data,
    module: RequestModule.AI
  })
}

export function deleteApiKeyAdmin(id: string): Promise<boolean> {
  return request<boolean>({
    url: '/api-key/admin/delete',
    method: 'delete',
    params: { id },
    module: RequestModule.AI
  })
}

export function getModelPage(params: ModelPageParams): Promise<PageResult<ModelItem>> {
  return request<PageResult<ModelItem>>({
    url: '/model/page',
    method: 'get',
    params,
    module: RequestModule.AI
  })
}

export function getModelAdminPage(params: ModelPageParams): Promise<PageResult<ModelItem>> {
  return request<PageResult<ModelItem>>({
    url: '/model/admin/page',
    method: 'get',
    params,
    module: RequestModule.AI
  })
}

export function createModel(data: ModelItem): Promise<string> {
  return request<string>({
    url: '/model/create',
    method: 'post',
    data,
    module: RequestModule.AI
  })
}

export function updateModel(data: ModelItem): Promise<boolean> {
  return request<boolean>({
    url: '/model/update',
    method: 'put',
    data,
    module: RequestModule.AI
  })
}

export function deleteModel(id: string): Promise<boolean> {
  return request<boolean>({
    url: '/model/delete',
    method: 'delete',
    params: { id },
    module: RequestModule.AI
  })
}

// 管理员专用接口
export function updateModelAdmin(data: ModelItem): Promise<boolean> {
  return request<boolean>({
    url: '/model/admin/update',
    method: 'put',
    data,
    module: RequestModule.AI
  })
}

export function deleteModelAdmin(id: string): Promise<boolean> {
  return request<boolean>({
    url: '/model/admin/delete',
    method: 'delete',
    params: { id },
    module: RequestModule.AI
  })
}
