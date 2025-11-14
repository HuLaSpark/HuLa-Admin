import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'
import type { LoginParams, LoginResponse, CaptchaResponse, UserInfo, ApiResponse } from '@/types/api'

/**
 * 登录
 * @param data 登录参数
 */
export function loginApi(data: LoginParams): Promise<ApiResponse<LoginResponse>> {
  return request({
    url: '/anyTenant/login',
    method: 'post',
    data,
    module: RequestModule.OAUTH,
    needToken: false
  })
}

/**
 * 获取验证码
 */
export function getCaptchaApi(): Promise<ApiResponse<CaptchaResponse>> {
  return request({
    url: '/anyTenant/captcha',
    method: 'get',
    module: RequestModule.OAUTH,
    needToken: false
  })
}

/**
 * 获取用户信息
 * 后端从 token 中获取当前登录用户的 userId
 */
export function getUserInfoApi(): Promise<ApiResponse<UserInfo>> {
  return request({
    url: '/anyone/getUserInfo',
    method: 'get',
    module: RequestModule.OAUTH
  })
}

/**
 * 刷新 Token
 * @param refreshToken 刷新令牌
 */
export function refreshTokenApi(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
  return request({
    url: '/anyTenant/login',
    method: 'post',
    data: {
      grantType: 'REFRESH_TOKEN',
      refreshToken
    },
    module: RequestModule.OAUTH,
    needToken: false
  })
}

/**
 * 退出登录
 * @param data 退出参数
 */
export function logoutApi(data: { token: string; refreshToken?: string }): Promise<ApiResponse> {
  return request({
    url: '/anyUser/logout',
    method: 'post',
    data,
    module: RequestModule.OAUTH
  })
}

/**
 * 修改密码
 * @param data 修改密码参数
 */
export function updatePasswordApi(data: {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<ApiResponse> {
  return request({
    url: '/anyUser/updatePassword',
    method: 'post',
    data,
    module: RequestModule.OAUTH
  })
}

/**
 * 切换租户和组织
 * @param data 切换参数
 */
export function switchTenantAndOrgApi(data: {
  orgId?: string
  clientId: string
}): Promise<ApiResponse<LoginResponse>> {
  return request({
    url: '/anyone/switchTenantAndOrg',
    method: 'put',
    params: data,
    module: RequestModule.OAUTH
  })
}

