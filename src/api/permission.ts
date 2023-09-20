import { createAxios } from '@/services/request'
import type { permission, deleteId, value } from '@/interface/IPermission'

const request = createAxios()

// 权限树 请求
export const permissionTree = (): Promise<value> => request.get('/permission/tree')

// 新增 请求
export const addPermissions = (form: permission): Promise<value> => request.post('/permission/add', form)

// 编辑 请求
export const editPermissions = (form: any): Promise<value> => {
  // 使用解构赋值来间接删除 form 对象中的 updateTime 字段
  const { updateTime, ...data } = form
  return request.post('/permission/edit', data)
}

// 删除 请求
export const deletePermission = (id: deleteId): Promise<value> => request.delete('/permission/' + id)
