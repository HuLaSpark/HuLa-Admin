import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { UserInfo, PageParams } from '@/types/api'

interface PageBaseResp<T> {
  pageNo: number
  pageSize: number
  totalRecords: number
  isLast?: boolean
  list: T[]
}

/**
 * 获取用户列表（分页）
 * @param params 分页参数
 */
export function getUserListApi(
  params: PageParams & Record<string, any>
): Promise<PageResponse<UserInfo>> {
  return request<PageResponse<UserInfo>>({
    url: '/user/page',
    method: 'get',
    params,
    module: RequestModule.BASE
  })
}

/**
 * 搜索用户
 * @param params 分页参数和搜索关键词
 */
export function searchUserByNicknameApi(params: {
  pageNo: number
  pageSize: number
  keyword?: string
  id?: string
}): Promise<PageBaseResp<UserInfo>> {
  return request<PageBaseResp<UserInfo>>({
    url: '/user/search',
    method: 'get',
    params,
    module: RequestModule.IM
  })
}

/**
 * 获取用户详情
 * @param id 用户 ID
 */
export function getUserDetailApi(id: string): Promise<UserInfo> {
  return request<UserInfo>({
    url: '/user/detail',
    method: 'get',
    params: { id },
    module: RequestModule.BASE
  })
}

/**
 * 新增用户
 * @param data 用户数据
 */
export function addUserApi(data: Partial<UserInfo>): Promise<void> {
  return request<void>({
    url: '/user/add',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}

/**
 * 编辑用户
 * @param data 用户数据
 */
export function editUserApi(data: Partial<UserInfo>): Promise<void> {
  return request<void>({
    url: '/user/edit',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}

/**
 * 删除用户
 * @param data 删除参数
 */
export function deleteUserApi(data: { id?: string; ids?: string[] }): Promise<void> {
  return request<void>({
    url: '/user/del',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}

/**
 * 重置用户密码
 * @param data 重置密码参数
 */
export function resetPasswordApi(data: { id: string; password: string }): Promise<void> {
  return request<void>({
    url: '/user/resetPassword',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}

/**
 * 修改用户状态
 * @param data 状态参数
 */
export function updateUserStateApi(data: { id: string; state: boolean }): Promise<void> {
  return request<void>({
    url: '/user/updateState',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}

/**
 * 获取当前用户信息（扩展）
 */
export function getCurrentUserInfoApi(): Promise<UserInfo> {
  return request<UserInfo>({
    url: '/user/current',
    method: 'get',
    module: RequestModule.BASE
  })
}

/**
 * 更新当前用户信息
 * @param data 用户数据
 */
export function updateCurrentUserApi(data: Partial<UserInfo>): Promise<void> {
  return request<void>({
    url: '/user/updateCurrent',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}


/**
 * 上传用户头像
 * @param file 头像文件
 */
export function uploadAvatarApi(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)

  return request<{ url: string }>({
    url: '/user/uploadAvatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    module: RequestModule.BASE
  })
}

