import { createAxios } from '@/services/request'
import { value } from '@/interface/IUser'

const request = createAxios()

//获取全部在线人数
export const OnlineUserPage = (): Promise<value> => request.get('/user/OnlineUser')

//把用户踢下线
export const kickOutUser = (uid: any): Promise<value> => request.get('/user/kick/' + uid)

//切换身份查看权限
export const changeUser = (uid: any): Promise<value> => request.get('/user/change/' + uid)

//封禁用户
export const banUser = (uid: any): Promise<value> => request.get('/user/accountBan/' + uid)

//解封用户
export const unravelUser = (uid: any): Promise<value> => request.get('/user/accountUnseal/' + uid)

//续签过期token
export const renewToken = (user: any): Promise<value> => request.post('/renew', user)
