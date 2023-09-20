import { createAxios } from '@/services/request'
import { Dict, parameter, deleteId, value } from '@/interface/IDict'

const request = createAxios()

// 分页 请求
export const dictPage = (params: parameter): Promise<value> => request.get('/dict/page', { params })

//创建 请求
export const addDict = (form: Dict): Promise<value> => request.post('/dict/add', form)

//编辑 请求
export const editDict = (form: Dict): Promise<value> => {
  return request.post('/dict/edit', form)
}

//删除单个 请求
export const deleteDict = (id: deleteId): Promise<value> => request.delete('/dict/' + id)

//批量删除 请求
export const deleteBatchDict = (batch: any): Promise<value> => request.post('/dict/delete/batch', batch)

// 获取图标 请求
export const getIconList = (): Promise<value> => request.get('/dict/icons')
