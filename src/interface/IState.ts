import type { UserInfo } from '@/types/api'
import type { Menu } from '@/services/types'

interface IState {
  loginInfo: {
    /** 用户信息 */
    sysUser?: UserInfo & {
      id: string
      uid: string
      tenantId: string
      role: string
    }
    /** 公司名称 */
    companyName?: string
    /** 访问令牌 */
    token?: string
    /** 刷新令牌 */
    refreshToken?: string
    /** 菜单列表（前端侧边栏菜单结构） */
    menus?: Menu[]
    /** 权限列表 */
    auths?: Array<{ auth: string }>
    /** 角色列表 */
    roles?: Array<{ name: string; code: string }>
  }
}
export type { IState }
