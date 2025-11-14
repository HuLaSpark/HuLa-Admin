import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { UserInfo, PageParams, PageResponse, ApiResponse } from '@/types/api'

/**
 * 获取用户列表（分页）
 * @param params 分页参数
 */
export function getUserListApi(params: PageParams & Record<string, any>): Promise<ApiResponse<PageResponse<UserInfo>>> {
  return request({
    url: '/user/page',
    method: 'get',
    params,
    module: RequestModule.BASE
  })
}

/**
 * 获取用户详情
 * @param id 用户 ID
 */
export function getUserDetailApi(id: number | string): Promise<ApiResponse<UserInfo>> {
  return request({
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
export function addUserApi(data: Partial<UserInfo>): Promise<ApiResponse> {
  return request({
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
export function editUserApi(data: Partial<UserInfo>): Promise<ApiResponse> {
  return request({
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
export function deleteUserApi(data: { id?: number; ids?: number[] }): Promise<ApiResponse> {
  return request({
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
export function resetPasswordApi(data: { id: number; password: string }): Promise<ApiResponse> {
  return request({
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
export function updateUserStateApi(data: { id: number; state: boolean }): Promise<ApiResponse> {
  return request({
    url: '/user/updateState',
    method: 'post',
    data,
    module: RequestModule.BASE
  })
}

/**
 * 获取当前用户信息（扩展）
 */
export function getCurrentUserInfoApi(): Promise<ApiResponse<UserInfo>> {
  return request({
    url: '/user/current',
    method: 'get',
    module: RequestModule.BASE
  })
}

/**
 * 更新当前用户信息
 * @param data 用户数据
 */
export function updateCurrentUserApi(data: Partial<UserInfo>): Promise<ApiResponse> {
  return request({
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
export function uploadAvatarApi(file: File): Promise<ApiResponse<{ url: string }>> {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/user/uploadAvatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    module: RequestModule.BASE
  })
}

