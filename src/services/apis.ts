import { createAxios } from '@/services/request'
import urls from '@/services/urls'
import type { BatchDelete, login, parameter, Response, UpdateUser, User } from '@/services/types'

const request = createAxios()

const GET = <T>(url: string, params?: any) => request.get<T, Response>(url, params)
const POST = <T>(url: string, params?: any) => request.post<T, Response>(url, params)
const PUT = <T>(url: string, params?: any) => request.put<T, Response>(url, params)
const DELETE = <T>(url: string, params?: any) => request.delete<T, Response>(url, params)

export default {
  /*登录 请求*/
  login: (form: login): Promise<Response> => POST(urls.login, form),
  /*退出 请求*/
  logout: (): Promise<Response> => GET(urls.logout),
  /*获取公钥*/
  getPublicKey: (): Promise<Response> => POST(urls.getPublicKey),
  /*获取租户列表*/
  getTenantList: (): Promise<Response> => GET(urls.tenantList),

  /*  ====================用户管理==================== */
  /*根据用户名查询*/
  withNameQuery: (userName: Pick<User, 'userName'>): Promise<Response> => GET(urls.user, userName),
  /*新增 用户*/
  addUser: (form: User): Promise<Response> => POST(urls.user, form),
  /*删除单个 用户*/
  deleteUser: (id: string, username: string, uid: string): Promise<Response> =>
    DELETE(urls.user + '/' + id + '/' + username + '/' + uid),
  /*批量删除 用户*/
  batchDeleteUsers: (data: BatchDelete): Promise<Response> => POST(urls.user + '/delete/batch', data),
  /*修改 用户*/
  editUser: (form: UpdateUser): Promise<Response> => PUT(urls.user, form),
  /*用户分页 请求*/
  userPage: (params: parameter): Promise<Response> => GET(urls.user + '/page', { params }),

  /*  ====================角色管理==================== */
  /*新增 角色*/
  addRole: (form: any): Promise<Response> => POST(urls.role, form),
  /*删除单个 角色*/
  deleteRole: (id: string): Promise<Response> => DELETE(urls.role + '/' + id),
  /*批量删除 角色*/
  batchDeleteRoles: (data: BatchDelete): Promise<Response> => POST(urls.role + '/delete/batch', data),
  /*修改 角色*/
  editRole: (form: any): Promise<Response> => PUT(urls.role, form),
  /*角色分页 请求*/
  rolePage: (params: parameter): Promise<Response> => GET(urls.role + '/page', { params }),
  /*获取角色列表*/
  getRoleList: (): Promise<Response> => GET(urls.role)
}
