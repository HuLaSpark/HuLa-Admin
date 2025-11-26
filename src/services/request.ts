import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { userStore } from '@/stores/user'
import router from '@/router'
import { RCodeEnum } from '@/enums'
import { Report } from 'notiflix'
import { useLogin } from '@/hooks/useLogin'

/*用户状态图标*/
export const networkIcon = ref()
//请求配置
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y'
const getBaseURL = (): string => {
  if (isHttpProxy) return ''
  return import.meta.env.VITE_API_BASE_URL || '/api'
}

export const createAxios = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    //请求头
    // baseURL: import.meta.env.VITE_BASE_URL,
    baseURL: getBaseURL(),
    //超时配置
    timeout: 10000,
    //跨域携带cookie
    withCredentials: true,
    // 自定义配置覆盖基本配置
    ...config
  })

  // 添加请求拦截器
  instance.interceptors.request.use(
    function (config: any) {
      //判断是否有token 根据自己的需求判断
      const token = userStore().getBearerToken
      if (token != undefined) {
        //如果要求携带在参数中
        // config.params = Object.assign({}, config.params, token)
        // 如果要求携带在请求头中
        // config.headers = Object.assign({}, config.headers, operate.uploadParameters())
        config.headers['Content-Type'] = 'application/json;charset=utf-8'
        // 设置请求头
        config.headers['Authorization'] = token
      }
      networkIcon.value = 'success'
      return config
    },
    function (error) {
      // 请求错误
      return Promise.reject(error)
    }
  )

  // 添加响应拦截器
  instance.interceptors.response.use(
    (response) => {
      //返回参数
      let res = response.data
      // 如果是返回的文件
      if (response.config.responseType === 'blob') {
        return res
      }
      // 兼容服务端返回的字符串数据
      if (typeof (<string>res) === 'string') {
        res = res ? JSON.parse(res) : res
      }
      //判断响应体中的错误码，如果是403则无权限请求
      if (res.code === RCodeEnum.UNAUTHORIZED) {
        window.$message.error(res.msg)
      }
      //判断响应体中的错误码，如果是U00006则需要重新登录
      if (res.code === RCodeEnum.STATE_EXCEPTION) {
        nextTick(() => {
          useLogin()
            .exit(false)
            .then(() => {
              window.$message.error(res.msg)
            })
        }).then(() => {
          router.push('/login')
          /*需要重新登录的都需要把localStorage中的用户信息给清除*/
          const userInfoStore = userStore()
          userInfoStore.logout()
        })
      }
      return res
    },
    (error) => {
      /***** 接收到异常响应的处理开始 *****/
      if (error && error.response) {
        // 1.公共错误处理
        // 2.根据响应码具体处理
        switch (error.response.status) {
          case 400:
            error.message = '错误请求'
            break
          case 401:
            error.message = '未授权，请重新登录'
            break
          case 403:
            error.message = '拒绝访问'
            break
          case 404:
            error.message = '请求错误,未找到该资源'
            window.location.href = '/NotFound'
            break
          case 405:
            error.message = '请求方法未允许'
            break
          case 408:
            error.message = '请求超时'
            break
          case 500:
            error.message = '服务器端出错'
            break
          case 501:
            error.message = '网络未实现'
            break
          case 502:
            error.message = '网络错误'
            break
          case 503:
            error.message = '服务不可用'
            break
          case 504:
            error.message = '网络超时'
            break
          case 505:
            error.message = 'http版本不支持该请求'
            break
          default:
            error.message = `连接错误${error.response.status}`
        }
      } else {
        // 超时处理
        if (JSON.stringify(error).includes('timeout')) {
          error.message = '服务器响应超时，请刷新当前页'
        } else {
          error.message = '连接服务器失败'
        }
      }
      /*提示*/
      networkIcon.value = 'error'
      if (error.response.status === 500) {
        Report.failure(error.message, error.response.statusText, '知道了', {
          titleFontSize: '18px',
          messageFontSize: '16px'
        })
      }
      window.$message.error(error.message)
      /***** 处理结束 *****/
      return Promise.resolve(error.response)
    }
  )

  return instance
}
