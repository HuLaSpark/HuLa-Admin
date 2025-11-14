/**
 * 类型定义文件
 * 注意：请使用TSDoc规范进行注释，以便在使用时能够获得良好提示。
 * @see TSDoc规范https://tsdoc.org/
 **/
import { GlobalStatusEnum, RCodeEnum } from '@/enums'
import { DataTableRowKey } from 'naive-ui'

/*响应请求体*/
export type Response = {
  code: RCodeEnum
  msg: string
  data: {
    records: any
    total: number
  }
  fail: boolean
  success: boolean
  version: string
}
/*菜单*/
export type Menu = {
  /** 路由路径，根 Home 一般为 'home' */
  path: null | string
  /** 对应前端路由 name，可为空（仅作为分组的菜单） */
  page?: string
  /** 菜单展示名称 */
  name: string
  /** 菜单/路由唯一标识 */
  id?: string
  /** 图标名称（可选） */
  icon?: string
  /** 是否在菜单中隐藏 */
  hideMenu?: boolean
  /** 是否在菜单中隐藏子菜单 */
  hideChildrenInMenu?: boolean
  /** 子菜单 */
  children?: Menu[]
}
/*分页搜索*/
export type parameter = {
  pageNum: number
  pageSize: number
  userName: string
}
/*登录类型*/
export type login = {
  cipherData: string
}
/*用户*/
export type User = {
  id: string
  uid: string
  userName: string
  password: string
  role: string
  status: number
  email: string
  mobile: string
  avatar: string
  createTime: string
  updateTime: string
}
/*分页用户*/
export type pageUser = {
  id: string
  uid: string
  userName: string
  nickName: string
  role: string
  status: number
  email: string
  mobile: string
  avatar: string
  /*!资料完整度不需要后端传递*/
  integrity?: number[]
  createTime: string
  updateTime: string
}
/*更新用户*/
export type UpdateUser = {
  id: string
  userName: string
  role: string
  status: number
  avatar: string
}
/*批量删除*/
export type BatchDelete = {
  ids: DataTableRowKey[]
  uids?: string[]
}
/*记住我*/
export type Renew = {
  userName: string
  password: string
}
/*角色*/
export type Role = {
  id: string
  name: string
  flag: string
}
/*角色权限的类型*/
export type RoleType = {
  HL_ROOT: 'hl_root'
  HL_SYS: 'hl_sys_manage'
  HL_ORD: 'hl_ord_user' | 'hl_ord_cs'
}
/*全局设置类型*/
export type globalSetting = {
  theme: {
    [key: string]: {
      status: boolean
    }
  }
  tags: {
    [key: string]: {
      item: string[]
      double: boolean
    }
  }
}
/*全局按钮类型*/
export type ButtonType = keyof typeof GlobalStatusEnum
