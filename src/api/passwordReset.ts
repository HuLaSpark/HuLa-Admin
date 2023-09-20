import { createAxios } from '@/services/request'
import type { value } from '@/interface/IUser'

const request = createAxios()

// 发送邮箱验证码
export const sendEmail = (email: string): Promise<value> => request.get('/email/' + email)

// 重置密码
export const passwordReset = (resetBody: any): Promise<value> => request.post('/pawReset', resetBody)
