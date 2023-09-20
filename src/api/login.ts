import { createAxios } from '@/services/request'

const request = createAxios()

//登录 请求
export const login = (user: any): Promise<any> => request.post('/pass/login', user)

//退出 请求
export const logout = (uid: any): Promise<any> => request.get('/logout/' + uid)
