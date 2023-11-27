import { createAxios } from '@/services/request'
import urls from '@/services/urls'
import type { Response, UpdateUser, User, parameter, Renew, login, BatchDeleteUser } from '@/services/types'

const request = createAxios()

const GET = <T>(url: string, params?: any) => request.get<T, Response>(url, params)
const POST = <T>(url: string, params?: any) => request.post<T, Response>(url, params)
const PUT = <T>(url: string, params?: any) => request.put<T, Response>(url, params)
const DELETE = <T>(url: string, params?: any) => request.delete<T, Response>(url, params)

export default {
  /*登录 请求*/
  login: (form: login): Promise<Response> => POST(urls.login, form),
  /*退出 请求*/
  logout: (uid: string): Promise<Response> => GET(urls.logout + '/' + uid),
  /*获取公钥*/
  getPublicKey: (): Promise<Response> => POST(urls.getPublicKey),
  /*系统用户分页 请求*/
  userPage: (params: parameter): Promise<Response> => GET(urls.userPage, { params }),
  /*新增 用户*/
  addUser: (form: User): Promise<Response> => POST(urls.userCRUD, form),
  /*删除单个 用户*/
  deleteUser: (id: number, username: string, uid: string): Promise<Response> =>
    DELETE(urls.userCRUD + '/' + id + '/' + username + '/' + uid),
  /*批量删除 用户*/
  batchDeleteUsers: (data: BatchDeleteUser): Promise<Response> => POST(urls.userCRUD + '/delete/batch', data),
  /*修改 用户*/
  editUser: (form: UpdateUser): Promise<Response> => PUT(urls.userCRUD, form),
  /*续签 请求*/
  renew: (user: Renew): Promise<Response> => POST(urls.renew, user),
  /*获取角色列表*/
  getRoleList: (): Promise<Response> => GET(urls.roleList),
  /*获取租户列表*/
  getTenantList: (): Promise<Response> => GET(urls.tenantList)
}
