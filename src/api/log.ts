import { createAxios } from '@/services/request'
import { parameter, value } from '@/interface/ILog'

const request = createAxios()

// 分页 请求
export const logPage = (params: parameter): Promise<value> => request.get('/log/page', { params })
