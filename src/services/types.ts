/**
 * 类型定义文件
 * 注意：请使用TSDoc规范进行注释，以便在使用时能够获得良好提示。
 * @see TSDoc规范https://tsdoc.org/
 **/
import type { RCodeEnum } from '@/enums'

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

export type Menu = {
  path: null | string
  page: string
  name: string
  id: number
  icon: string
  children?: Menu[]
}

export type parameter = {
  pageNum: number
  pageSize: number
  name: string
}

export type User = {
  id: number
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

export type pageUser = {
  id: number
  userName: string
  role: string
  status: number
  email: string
  mobile: string
  avatar: string
  createTime: string
  updateTime: string
}

export type UpdateUser = {
  id: number
  userName: string
  role: string
  status: number
  avatar: string
}

export type Renew = {
  userName: string
  password: string
}
