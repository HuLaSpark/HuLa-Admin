import type { RouteItem } from '@/types/api'

interface MenuItem {
  /** 菜单/路由唯一标识 */
  id?: string
  /** 路由路径 */
  path?: string | null
  /** 菜单名称 */
  name: string
  /** 用于前端 route name 的标识 */
  page?: string
  /** 图标 */
  icon?: string
  /** 是否在菜单中隐藏此项 */
  hideMenu?: boolean
  /** 是否在菜单中隐藏子路由 */
  hideChildrenInMenu?: boolean
  /** 子菜单 */
  children?: MenuItem[]
}

export type { MenuItem, RouteItem }
