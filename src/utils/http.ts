import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { ApiResponse } from '@/types/api'
import { RequestModule, getModuleProxyPath, getModuleRealPath } from '@/enums/request'
import { userStore } from '@/stores/user'

/** 请求配置 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示错误提示 */
  showError?: boolean
  /** 是否显示加载提示 */
  showLoading?: boolean
  /** 是否需要 Token */
  needToken?: boolean
  /** 请求模块 */
  module?: RequestModule
}

/** 错误消息栈，用于防止重复弹窗 */
let errMsgStack: string[] = []
/** 是否正在处理退出登录 */
let isLoggingOut = false

/** 是否启用代理 */
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y'

/** 获取 baseURL */
const getBaseURL = (): string => {
  if (isHttpProxy) {
    // 开发环境使用代理，返回空字符串（由代理处理）
    return ''
  }
  // 生产环境直接使用 Gateway 地址
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:18760'
}

/**
 * 获取 Basic Auth Authorization
 */
const getBasicAuthorization = (): string => {
  const secretKey = import.meta.env.VITE_SECRET_KEY || 'luohuo_web_pro:luohuo_web_pro_secret'
  // Base64 编码
  return btoa(secretKey)
}

/** 创建 Axios 实例 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config: any) => {
      const store = userStore()
      const requestConfig = config as RequestConfig

      // 处理 URL
      if (requestConfig.module) {
        const modulePrefix = isHttpProxy
          ? getModuleProxyPath(requestConfig.module) // 开发环境：/proxy-oauth
          : getModuleRealPath(requestConfig.module) // 生产环境：/oauth、/base 等

        // 如果 URL 不是以 http 开头，添加模块前缀
        if (config.url && !config.url.startsWith('http')) {
          config.url = `${modulePrefix}${config.url}`
        }
      }

      // 添加 Basic Auth Authorization
      config.headers['Authorization'] = getBasicAuthorization()

      // 添加用户 Token
      if (config.needToken !== false && store.getToken) {
        config.headers['Token'] = store.getToken
      }

      // 添加应用 ID
      config.headers['Applicationid'] = 1

      // 添加租户 ID
      const tenantId = store.getTenantId
      if (tenantId) {
        config.headers['tenant-id'] = tenantId
      }

      // 添加当前路由路径
      if (window.$router) {
        const currentRoute = window.$router.currentRoute.value
        if (currentRoute) {
          config.headers['Path'] = currentRoute.fullPath?.split('?')[0]
        }
      }

      console.log('📡 Request:', config.method?.toUpperCase(), config.url)

      return config
    },
    (error: AxiosError) => {
      console.error('❌ Request Error:', error)
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data, config } = response
      const requestConfig = config as RequestConfig

      // 打印响应日志
      console.log('✅ Response:', config.url, data)

      // 判断响应是否成功
      if (data.code === 200 || data.success) {
        return response
      }

      // 处理业务错误
      handleBusinessError(data, requestConfig)
      return Promise.reject(data)
    },
    (error: AxiosError<ApiResponse>) => {
      console.error('❌ Response Error:', error)

      // 处理 HTTP 错误
      handleHttpError(error)
      return Promise.reject(error)
    }
  )

  return instance
}

/**
 * 处理业务错误
 * @param data 响应数据
 * @param config 请求配置
 */
function handleBusinessError(data: ApiResponse, config: RequestConfig) {
  const store = userStore()
  const responseCode = String(data.code)

  // 获取环境变量配置的错误码
  const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || []
  const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || []

  // 如果正在处理退出登录，直接返回，避免重复处理
  if (isLoggingOut) {
    console.log('⏸️ 正在处理退出登录，跳过当前错误处理')
    return
  }

  // 处理需要直接退出登录的错误码（如 401）
  if (logoutCodes.includes(responseCode)) {
    console.warn(`🚪 检测到退出登录错误码: ${responseCode}，即将退出登录`)

    // 设置退出登录标志
    isLoggingOut = true

    window.$message?.error(data.msg || '登录已过期，请重新登录')

    // 延迟执行退出登录，确保消息显示
    setTimeout(() => {
      store.logout().finally(() => {
        // 重置标志
        isLoggingOut = false
      })
    }, 100)
    return
  }

  // 处理需要弹窗提示后退出登录的错误码（如 406 token已过期）
  if (modalLogoutCodes.includes(responseCode)) {
    const errorMsg = data.msg || 'Token 已过期，请重新登录'

    // 检查是否已经显示过相同的错误消息
    if (errMsgStack.includes(errorMsg)) {
      console.log('⏸️ 该错误消息已经显示，跳过重复弹窗')
      return
    }

    console.warn(`⚠️ 检测到 token 过期错误码: ${responseCode}，弹窗提示后退出登录`)

    // 设置退出登录标志
    isLoggingOut = true

    // 添加到错误消息栈
    errMsgStack.push(errorMsg)

    // 防止用户刷新页面
    const handleBeforeUnload = () => {
      handleLogout()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    // 退出登录处理函数
    const handleLogout = () => {
      // 清理
      window.removeEventListener('beforeunload', handleBeforeUnload)
      errMsgStack = errMsgStack.filter((msg) => msg !== errorMsg)

      // 执行退出登录
      store.logout().finally(() => {
        // 重置标志
        isLoggingOut = false
      })
    }

    // 使用 naive-ui 的 dialog 弹窗
    window.$dialog?.error({
      title: '提示',
      content: errorMsg,
      positiveText: '确定',
      maskClosable: false,
      closable: false,
      onPositiveClick: () => {
        handleLogout()
      },
      onClose: () => {
        handleLogout()
      }
    })
    return
  }

  // 403 无权限
  if (responseCode === '403') {
    window.$message?.error(data.msg || '无权限访问')
    return
  }

  // 其他错误
  if (config.showError !== false) {
    window.$message?.error(data.msg || '请求失败')
  }
}

/**
 * 处理 HTTP 错误
 * @param error Axios 错误对象
 */
function handleHttpError(error: AxiosError<ApiResponse>) {
  const store = userStore()

  if (error.response) {
    const { status, data } = error.response

    switch (status) {
      case 401:
        window.$message?.error('登录已过期，请重新登录')
        store.logout()
        break
      case 403:
        window.$message?.error('无权限访问')
        break
      case 404:
        window.$message?.error('请求的资源不存在')
        break
      case 500:
        window.$message?.error(data?.msg || '服务器错误')
        break
      default:
        window.$message?.error(data?.msg || `请求失败 (${status})`)
    }
  } else if (error.request) {
    window.$message?.error('网络错误，请检查网络连接')
  } else {
    window.$message?.error(error.message || '请求失败')
  }
}

/** 创建 HTTP 实例 */
const http = createAxiosInstance()

/**
 * GET 请求
 * @param url 请求地址
 * @param config 请求配置
 */
export async function get<T = any>(url: string, config?: RequestConfig): Promise<T> {
  const res = await http.get<ApiResponse<T>>(url, config)
  return res.data.data
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 */
export async function post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  const res = await http.post<ApiResponse<T>>(url, data, config)
  return res.data.data
}

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 */
export async function put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  const res = await http.put<ApiResponse<T>>(url, data, config)
  return res.data.data
}

/**
 * DELETE 请求
 * @param url 请求地址
 * @param config 请求配置
 */
export async function del<T = any>(url: string, config?: RequestConfig): Promise<T> {
  const res = await http.delete<ApiResponse<T>>(url, config)
  return res.data.data
}

/**
 * 通用请求方法
 * @param config 请求配置
 */
export async function request<T = any>(config: RequestConfig): Promise<T> {
  const res = await http.request<ApiResponse<T>>(config)
  return res.data.data
}

export default http
