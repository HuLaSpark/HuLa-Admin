import { createAxios } from '@/services/request'
import type { deleteId, parameter, value } from '@/interface/IRole'

const request = createAxios()

// 分页 请求
export const rolePage = (params: parameter): Promise<value> => request.get('/role/page', { params })

//新增 请求
export const addRole = (form: any): Promise<value> => request.post('/role/addRole', form)

//编辑 请求
export const editRole = (form: any): Promise<value> => {
  // 使用解构赋值来间接删除 form 对象中的 updateTime 字段
  const { updateTime, ...data } = form
  return request.post('/role/editRole', data)
}

//删除 请求
export const deleteRole = (id: deleteId): Promise<value> => request.delete('/role/' + id)

// 查询角色列表
export const getAllRole = (): Promise<value> => request.get('/role')
