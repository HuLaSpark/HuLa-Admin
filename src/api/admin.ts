import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'

/**
 * 黑名单统计
 */
export interface BlackStats {
  /** 今日新增黑名单 */
  todayNew: number
  /** 本周新增黑名单 */
  weekNew: number
  /** 黑名单总数 */
  total: number
}

/**
 * AI 统计
 */
export interface AiStats {
  /** 今日调用次数 */
  todayCalls: number
  /** 本周调用次数 */
  weekCalls: number
  /** 活跃模型数 */
  activeModels: number
}

/**
 * 首页统计数据
 */
export interface HomeStatsResponse {
  /** 今日活跃用户数 */
  todayActiveUser: number
  /** 群聊总数 */
  totalGroup: number
  /** 当前黑名单数 */
  blackCount: number
  /** 今日 AI 调用次数 */
  aiCallToday: number
  /** 黑名单统计 */
  blackStats: BlackStats
  /** AI 统计 */
  aiStats: AiStats
  monthlyLogin3PlusUserCount: number
}

/**
 * 获取首页统计数据
 */
export function getHomeStats(): Promise<HomeStatsResponse> {
  return request<HomeStatsResponse>({
    url: '/admin/stats/home',
    method: 'get',
    module: RequestModule.IM
  })
}

export interface LoginRankItem {
  userId: string
  username: string
  nickName: string
  total: number
}

export function getLoginRank(params: {
  start?: string
  end?: string
  rangeDays?: number
  limit?: number
}): Promise<LoginRankItem[]> {
  return request<LoginRankItem[]>({
    url: '/admin/stats/login-rank',
    method: 'get',
    module: RequestModule.IM,
    params
  })
}

export interface ActiveUserItem {
  username: string
  nickName: string
  avatar: string
  lastOptTime: string
  ip: string
  location: string
  isp: string
  loginTimes: number
}

export function getActiveUsers(params: {
  start?: string
  end?: string
  rangeDays?: number
  limit?: number
}): Promise<ActiveUserItem[]> {
  return request<ActiveUserItem[]>({
    url: '/admin/stats/active-users',
    method: 'get',
    module: RequestModule.IM,
    params
  })
}
