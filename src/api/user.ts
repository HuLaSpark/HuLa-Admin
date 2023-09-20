//导入 Axios 请求
import { createAxios } from '@/services/request'
import type { parameter, deleteId, value } from '@/interface/IUser'

const request = createAxios()

// 分页 请求
export const UserPage = (params: parameter): Promise<value> => request.get('/user/page', { params })

//删除单个用户 请求
export const DeleteUser = (id: deleteId, username: any, uid: any): Promise<value> =>
  request.delete('/user/' + id + '/' + username + '/' + uid)

//批量删除用户 请求
export const DeleteBatch = (batchUsers: any): Promise<value> => request.post('/user/delete/batch', batchUsers)

//创建用户 请求
export const AddUser = (form: any): Promise<value> => request.post('/user', form)

//编辑用户信息
export const EditUser = (form: any): Promise<value> => {
  // 使用解构赋值来间接删除 form 对象中的 updateTime 字段
  const { updateTime, ...data } = form
  return request.post('/user/edit', data)
}

//创建时根据用户名查询用户是否已经创建
export const WithNameQuery = (UserName: any): Promise<value> => request.get('/user/' + UserName)

// 根据uid来查询用户信息
export const getUserInfo = (uid: any): Promise<value> => request.get('/user/getUserInfo/' + uid)

// // post 请求
// export const exportPost = (data: any) =>
//     //请求 token 添加
//     // request.post("/export", Object.assign(data, { token: operate.isToken() }));
//     request.post("/export", data);

/*
请求配置与使用

* POST 请求 方式
    export const 名字 = (data: any) =>
        request.post("接口", data, {
            直接为空
            注：只能配置 AxiosRequestConfig 里有的参数名 可不用配置
        });

* GET 请求 方式
    export const 名字 = (params: any): Promise<any> =>
        request.get("接口", { params });

*使用 方法
   *引入
        import {
            名字
        } from "../api/api"
    *生命周期中 请求
        名字({请求参数}).then((res) => {
            console.log(res)
        })
*/
