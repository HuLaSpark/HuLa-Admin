import { request } from '@/utils/http'
import { RequestModule } from '@/enums/request'

/**
 * 群聊列表项
 */
export interface ImGroupItem {
  /** 群聊 id */
  groupId: string
  /** 房间 id */
  roomId: string
  /** 群名称 */
  groupName: string
  /** 群头像 */
  avatar?: string
  /** 在线人数 */
  onlineNum?: number
  /** 群成员数 */
  memberNum?: number
  /** 群号 */
  account?: string
  /** 备注 */
  remark?: string
  /** 是否允许扫码直接进群 */
  allowScanEnter?: boolean
}

/**
 * 群成员信息
 */
export interface ImGroupMember {
  /** 群成员表 id */
  id: string
  /** uid */
  uid: string
  /** 用户昵称 */
  name?: string
  /** 我的群昵称 */
  myName?: string
  /** 账号 */
  account?: string
  /** 头像 */
  avatar?: string
  /** 在线状态 1在线 2离线 */
  activeStatus?: number
  /** 角色ID 1群主 2管理员 3普通成员 4踢出群聊 */
  roleId?: number
  /** IP 归属地 */
  locPlace?: string
  /** 最后一次上下线时间 */
  lastOptTime?: string
}

/**
 * 获取当前账号加入的群聊列表
 */
export function getImGroupList() {
  return request<ImGroupItem[]>({
    url: '/room/group/list',
    method: 'get',
    module: RequestModule.IM
  })
}

/**
 * 群聊分页响应
 */
export interface ImGroupPageResp {
  /** 当前页数 */
  pageNo: number
  /** 每页数量 */
  pageSize: number
  /** 总记录数 */
  totalRecords: number
  /** 是否最后一页 */
  isLast?: boolean
  /** 数据列表 */
  list: ImGroupItem[]
}

/**
 * 分页查询所有群聊列表（管理员专用，支持按群昵称和群成员昵称搜索）
 */
export function getImGroupPage(params: {
  pageNo: number
  pageSize: number
  groupNameKeyword?: string
  memberNameKeyword?: string
}): Promise<ImGroupPageResp> {
  return request<ImGroupPageResp>({
    url: '/room/group/page',
    method: 'get',
    params,
    module: RequestModule.IM
  })
}

/**
 * 群公告信息
 */
export interface ImGroupAnnouncement {
  /** 公告 ID */
  id: string
  /** 房间 ID */
  roomId: string
  /** 发布者 UID */
  uid: string
  /** 公告内容 */
  content: string
  /** 是否置顶 */
  top: boolean
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  /** 数据列表 */
  records: T[]
  /** 总数 */
  total: number
  /** 当前页 */
  current: number
  /** 每页大小 */
  size: number
}

/**
 * 获取群公告列表
 */
export function getImGroupAnnouncementList(params: {
  roomId: string
  current: number
  size: number
}) {
  return request<PageResponse<ImGroupAnnouncement>>({
    url: '/room/announcement/list',
    method: 'get',
    params,
    module: RequestModule.IM
  })
}

/**
 * 编辑群公告
 */
export function editImGroupAnnouncement(data: {
  id: string
  roomId: string
  content: string
  top: boolean
}) {
  return request<boolean>({
    url: '/room/announcement/edit',
    method: 'post',
    data,
    module: RequestModule.IM
  })
}

/**
 * 删除群公告
 */
export function deleteImGroupAnnouncement(params: { id: string }) {
  return request<boolean>({
    url: '/room/announcement/delete',
    method: 'post',
    params,
    module: RequestModule.IM
  })
}

/**
 * 修改群成员昵称（管理员专用）
 */
export function updateMemberNickname(data: {
  roomId: string
  uid: string
  myName: string
  remark: string
}) {
  return request<void>({
    url: '/room/group/member/nickname',
    method: 'post',
    data,
    module: RequestModule.IM
  })
}

/**
 * 踢出群成员
 */
export function removeMember(data: { roomId: string; uidList: string[] }) {
  return request<void>({
    url: '/room/group/member',
    method: 'delete',
    data,
    module: RequestModule.IM
  })
}

/**
 * 添加管理员
 */
export function addAdmin(data: { roomId: string; uidList: string[] }) {
  return request<void>({
    url: '/room/group/admin',
    method: 'put',
    data,
    module: RequestModule.IM
  })
}

/**
 * 撤销管理员
 */
export function revokeAdmin(data: { roomId: string; uidList: string[] }) {
  return request<void>({
    url: '/room/group/admin',
    method: 'delete',
    data,
    module: RequestModule.IM
  })
}

/**
 * 禁言群成员
 */
export function muteMember(data: { roomId: string; uid: string; duration: number }) {
  return request<void>({
    url: '/room/group/mute',
    method: 'post',
    data,
    module: RequestModule.IM
  })
}

/**
 * 取消禁言
 */
export function unmuteMember(data: { roomId: string; uid: string }) {
  return request<void>({
    url: '/room/group/unmute',
    method: 'post',
    data,
    module: RequestModule.IM
  })
}

/** 简化的群成员信息 */
export interface ImGroupMemberSimple {
  /** 用户 UID */
  uid: string
  /** 昵称 */
  name: string
  /** 角色 ID：1=群主，2=管理员，3=普通成员，4=已被移出 */
  roleId: number
  /** 在线状态：1=在线，2=离线 */
  activeStatus: number
  /** IP 归属地 */
  locPlace: string
  /** IP 地址 */
  ipAddress: string
}

/** 群成员分页响应 */
export interface ImGroupMemberPageResp {
  /** 当前页数 */
  pageNo: number
  /** 每页数量 */
  pageSize: number
  /** 总记录数 */
  totalRecords: number
  /** 是否最后一页 */
  isLast?: boolean
  /** 数据列表 */
  list: ImGroupMemberSimple[]
}

/**
 * 获取群成员列表
 */
export function getImGroupMemberPage(params: {
  roomId: string
  pageNo: number
  pageSize: number
}): Promise<ImGroupMemberPageResp> {
  return request<ImGroupMemberPageResp>({
    url: '/room/group/member/page',
    method: 'get',
    params,
    module: RequestModule.IM
  })
}

/**
 * 修改群信息
 */
export function updateRoomInfo(data: {
  id: string
  name: string
  avatar: string
  allowScanEnter: boolean
}): Promise<boolean> {
  return request<boolean>({
    url: '/room/updateRoomInfo',
    method: 'post',
    data,
    module: RequestModule.IM
  })
}

/**
 * 解散群聊
 */
export function disbandGroup(data: {
  roomId: string
}): Promise<void> {
  return request<void>({
    url: '/room/group/disband',
    method: 'post',
    data,
    module: RequestModule.IM
  })
}
