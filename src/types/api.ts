/** API 响应基础结构 */
export interface ApiResponse<T = any> {
  /** 响应码 */
  code: number
  /** 响应消息 */
  msg: string
  /** 响应数据 */
  data: T
  /** 是否成功 */
  success?: boolean
  /** 时间戳 */
  timestamp?: number
}

/** 分页参数 */
export interface PageParams {
  /** 当前页码 */
  pageNum: number
  /** 每页数量 */
  pageSize: number
}

/** 分页响应 */
export interface PageResponse<T = any> {
  /** 数据列表 */
  records: T[]
  /** 总数 */
  total: number
  /** 当前页 */
  current: number
  /** 每页大小 */
  size: number
  /** 总页数 */
  pages: number
}

/** ==================== Auth 模块 ==================== */

/** 登录参数 */
export interface LoginParams {
  /** 账号（用户名） */
  account: string
  /** 密码 */
  password?: string
  /** 手机号 */
  mobile?: string
  /** 验证码 */
  code?: string
  /** 验证码 key */
  key?: string
  /** 记住我 */
  rememberMe?: boolean
  /** 登录类型 */
  grantType: 'PASSWORD' | 'CAPTCHA' | 'REFRESH_TOKEN' | 'MOBILE'
  /** 客户端类型 */
  clientType?: string
  /** 登录源 */
  source?: string
  /** 设备指纹 */
  clientId: string
  /** 系统类型 (1-账号密码登录，2-IM聊天系统登录) */
  systemType: number
  /** 设备类型 */
  deviceType: 'PC' | 'MOBILE'
  /** 刷新令牌 */
  refreshToken?: string
}

/** 登录响应 */
export interface LoginResponse {
  /** 访问令牌 */
  token: string
  /** 刷新令牌 */
  refreshToken: string
  /** 用户 ID */
  uid: string
  /** 过期时间 */
  expire: string | number
  /** 过期时间戳 */
  expiration?: string
  /** 客户端 */
  client?: string
  /** 登录源 */
  source?: string
  /** UUID */
  uuid?: string
}

/** 验证码响应 */
export interface CaptchaResponse {
  /** 验证码图片 Base64 */
  image: string
  /** 验证码 key */
  key: string
  /** 过期时间（秒） */
  expire?: number
}

/** 用户信息 */
export interface UserInfo {
  /** 用户 ID */
  id: string
  /** 用户 UID */
  uid?: string
  /** 租户 ID */
  tenantId?: string
  /** 部门 ID */
  orgId?: string
  /** 小组 ID */
  groupId?: string
  /** 单位 ID */
  companyId?: string
  /** 岗位 ID */
  positionId?: string
  /** 账号名 */
  userName: string
  /** 昵称 */
  nickName?: string
  /** 头像 */
  avatar?: string
  /** 手机号 */
  mobile?: string
  /** 邮箱 */
  email?: string
  /** 性别 */
  sex?: string | number
  /** 状态 */
  state?: boolean
  /** 角色列表 */
  roles?: UserRole[]
  /** 权限列表 */
  permissions?: string[]
  /** 当前用户所属部门 */
  org?: Organization
  /** 当前用户所属单位 */
  company?: Organization
  /** 当前用户的岗位 */
  position?: Position
  /** 当前用户的所属公司列表 */
  companyList?: Organization[]
  /** 是否为超级管理员 */
  admin?: boolean
  /** 个人简介 */
  resume?: string
}

/** 角色对象 */
export interface UserRole {
  /** 角色 ID */
  id: string
  /** 角色类型 */
  type?: string
  /** 角色分类 */
  category?: string
  /** 角色名称 */
  name: string
  /** 角色标识 */
  roleKey?: string
  /** 角色编码 */
  code?: string
  /** 排序 */
  sort?: number
  /** 数据范围 */
  dataRange?: number
  /** 状态 */
  state?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否级联下级 */
  cascadeLower?: boolean
}

/** 组织机构对象 */
export interface Organization {
  /** 组织 ID */
  id: string
  /** 组织名称 */
  orgName?: string
  /** 组织编码 */
  code?: string
  /** 父级 ID */
  parentId?: string
  /** 排序 */
  sort?: number
  /** 状态 */
  state?: boolean
}

/** 岗位对象 */
export interface Position {
  /** 岗位 ID */
  id: string
  /** 岗位名称 */
  name: string
  /** 岗位编码 */
  code?: string
  /** 排序 */
  sort?: number
  /** 状态 */
  state?: boolean
}

/** ==================== Route 模块 ==================== */
/** 路由/菜单项 */
export interface RouteItem {
  /** 路由 ID */
  id?: string
  /** 路由名称 */
  name: string
  /** 路由路径 */
  path?: string
  /** 组件名称/页面名称 */
  component?: string
  /** 页面文件名（用于动态导入） */
  page?: string
  /** 图标 */
  icon?: string
  /** 排序 */
  order?: number
  /** 是否隐藏 */
  hidden?: boolean
  /** 是否缓存 */
  keepAlive?: boolean
  /** 重定向 */
  redirect?: string
  /** 子路由 */
  children?: RouteItem[]
  /** 元信息 */
  meta?: RouteMeta
}

/** 路由元信息 */
export interface RouteMeta {
  /** 标题 */
  title?: string
  /** 图标 */
  icon?: string
  /** 组件标识（如 LAYOUT） */
  component?: string
  /** 是否需要认证 */
  requiresAuth?: boolean
  /** 角色权限 */
  roles?: string[]
  /** 权限编码 */
  permissions?: string[]
  /** 是否缓存 */
  keepAlive?: boolean
  /** 是否隐藏（旧字段） */
  hidden?: boolean
  /** 是否隐藏菜单 */
  hideMenu?: boolean
  /** 是否在菜单中隐藏子路由 */
  hideChildrenInMenu?: boolean
  /** 是否动态添加 */
  dynamicAdded?: boolean
  /** 是否分页 */
  pagination?: boolean
}

/** 获取用户路由响应 */
export interface UserRoutesResponse {
  /** 是否启用URI/按钮权限 */
  enabled?: boolean
  /** 是否区分大小写 */
  caseSensitive?: boolean
  /** 拥有的资源编码 */
  resourceList?: string[]
  /** 拥有的菜单路由 */
  routerList: RouteItem[]
  /** 拥有的角色编码 */
  roleList?: string[]
}

/** ==================== Resource 模块 ==================== */
/** 资源树节点 */
export interface ResourceTreeNode {
  /** 资源 ID */
  id: string
  /** 资源名称 */
  name: string
  /** 资源编码 */
  code?: string
  /** 资源类型 */
  type?: string
  /** 父级 ID */
  parentId?: string
  /** 路径 */
  path?: string
  /** 组件 */
  component?: string
  /** 图标 */
  icon?: string
  /** 排序 */
  sort?: number
  /** 状态 */
  state?: boolean
  /** 子节点 */
  children?: ResourceTreeNode[]
}

/**
 * 租户信息
 */
export interface TenantInfo {
  /** 租户 ID */
  id: string
  /** 租户编码 */
  code?: string
  /** 租户名称 */
  name: string
  /** 租户简称 */
  abbreviation?: string
  /** 租户状态（0正常 1审核中 2停用 3待初始化租户） */
  status?: number
  /** 启用状态 */
  state?: boolean
  /** 联系人 */
  contactName?: string
  /** 联系手机 */
  contactMobile?: string
  /** 联系人（别名） */
  contactPerson?: string
  /** 联系电话（别名） */
  contactPhone?: string
  /** 绑定域名 */
  website?: string
  /** 统一社会信用代码 */
  creditCode?: string
  /** 有效期 */
  expirationTime?: string
  /** 企业简介 */
  intro?: string
  /** 是否默认租户 */
  isDefault?: boolean
  /** 员工状态 */
  employeeState?: boolean
  /** 员工 ID */
  employeeId?: string
}
