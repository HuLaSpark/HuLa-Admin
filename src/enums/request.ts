/** 请求模块枚举 */
export enum RequestModule {
  /** OAuth 模块 - 认证相关 */
  OAUTH = 'oauth',
  /** Base 模块 - 基础数据 */
  BASE = 'base',
  /** System 模块 - 系统后台 */
  SYSTEM = 'system',
  /** AI 模块 - AI 相关 */
  AI = 'ai',
  /** IM 模块 - 即时通讯服务 */
  IM = 'im'
}

/**
 * 获取模块代理路径（开发环境）
 * @param module 模块枚举
 * @returns 代理路径，如 /proxy-oauth
 */
export function getModuleProxyPath(module: RequestModule): string {
  return `/proxy-${module}`
}

/**
 * 获取模块真实路径（生产环境）
 * @param module 模块枚举
 * @returns 真实路径，如 /oauth
 */
export function getModuleRealPath(module: RequestModule): string {
  return `/${module}`
}

