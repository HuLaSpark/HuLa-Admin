import { defineStore } from 'pinia'
import router, { resetRouter, setRoutes } from '@/router'
import type { IState } from '@/interface/IState'
import { loginApi, getUserInfoApi, logoutApi, switchTenantAndOrgApi } from '@/api/auth'
import { getUserRoutesApi } from '@/api/route'
import { getUserTenantListApi } from '@/api/tenant'
import type { LoginParams, TenantInfo } from '@/types/api'

export const userStore = defineStore('localUserInfo', {
  state: (): IState =>
    <IState>{
      loginInfo: {}
    },
  getters: {
    getUserId(): any {
      return this.loginInfo.sysUser ? this.loginInfo.sysUser.id : ''
    },
    getUserUId(): any {
      return this.loginInfo.sysUser ? this.loginInfo.sysUser.uid : ''
    },
    getTenantId(): any {
      return this.loginInfo.sysUser ? this.loginInfo.sysUser.tenantId : ''
    },
    getUser(): any {
      return this.loginInfo.sysUser || {}
    },
    getBearerToken(): any {
      return this.loginInfo.token ? 'Bearer ' + this.loginInfo.token : ''
    },
    getToken(): any {
      return this.loginInfo.token || ''
    },
    getMenus(): any {
      return this.loginInfo.menus || []
    },
    getAuths(): any {
      return this.loginInfo.auths?.length ? this.loginInfo.auths.map((v) => v.auth) : []
    },
    getRole(): any {
      return this.loginInfo.sysUser?.role || ''
    },
    getCompanyName(): any {
      return this.loginInfo.companyName || ''
    },
    isLogin(): boolean {
      return !!this.loginInfo.token
    }
  },
  actions: {
    /**
     * 登录
     * @param loginParams 登录参数
     */
    async login(loginParams: LoginParams) {
      try {
        const res = await loginApi(loginParams)
        if (res.success && res.data) {
          this.loginInfo.token = res.data.token
          this.loginInfo.refreshToken = res.data.refreshToken
          const uid = res.data.uid

          if (!this.loginInfo.sysUser) {
            this.loginInfo.sysUser = {
              id: '',
              uid: uid,
              tenantId: '',
              role: ''
            } as any
          } else {
            this.loginInfo.sysUser.uid = uid
          }

          console.log('✅ 登录成功，token 和 uid 已保存:', {
            token: res.data.token?.substring(0, 20) + '...',
            uid,
            userId: this.loginInfo.sysUser?.id
          })

          // 等待租户选择后再获取用户信息和初始化路由
          return { success: true, needSelectTenant: true, uid: res.data.uid }
        } else {
          return { success: false, message: res.msg || '登录失败' }
        }
      } catch (error: any) {
        console.error('❌ 登录失败:', error)
        return { success: false, message: error.message || '登录失败' }
      }
    },

    /**
     * 获取用户的可用租户列表
     */
    async getUserTenantList(): Promise<TenantInfo[]> {
      try {
        const res = await getUserTenantListApi()
        if (res.success && res.data) {
          return res.data
        } else {
          console.error('获取租户列表失败:', res.msg)
          return []
        }
      } catch (error) {
        console.error('获取租户列表失败:', error)
        return []
      }
    },

    /**
     * 设置租户并初始化用户信息
     * @param tenantId 租户 ID
     */
    async setTenantAndInit(tenantId: string) {
      try {
        console.log('🏢 开始设置租户:', tenantId)

        if (!this.loginInfo.sysUser) {
          this.loginInfo.sysUser = {
            id: '',
            uid: '',
            tenantId,
            role: '',
            userName: ''
          } as any
        } else {
          this.loginInfo.sysUser.tenantId = tenantId
        }

        // 调用切换租户 API
        const switchRes = await switchTenantAndOrgApi({
          clientId: 'luohuo_web_pro' // 使用配置的客户端 ID
        })

        if (switchRes.success && switchRes.data) {
          // 更新 token
          if (switchRes.data.token) {
            this.loginInfo.token = switchRes.data.token
            console.log('✅ 切换租户成功，token 已更新')
          }
        } else {
          console.error('❌ 切换租户失败:', switchRes.msg)
          return { success: false, message: switchRes.msg || '切换租户失败' }
        }

        // 获取用户信息
        const userRes = await getUserInfoApi()
        if (userRes.success && userRes.data) {
          this.loginInfo.sysUser = {
            ...userRes.data,
            id: userRes.data.id || '',
            uid: userRes.data.uid || '',
            tenantId,
            role:
              Array.isArray(userRes.data.roles) && userRes.data.roles.length > 0
                ? userRes.data.roles[0].code || ''
                : ''
          }
          console.log('✅ 用户信息获取成功:', {
            id: userRes.data.id,
            userName: userRes.data.userName,
            tenantId: String(tenantId)
          })
        } else {
          console.error('❌ 获取用户信息失败:', userRes.msg)
          return { success: false, message: userRes.msg || '获取用户信息失败' }
        }

        // 初始化动态路由
        await this.initUserInfo()

        return { success: true }
      } catch (error: any) {
        console.error('❌ 设置租户失败:', error)
        return { success: false, message: error.message || '设置租户失败' }
      }
    },

    /**
     * 初始化用户信息（获取动态路由）
     */
    async initUserInfo() {
      try {
        const routeRes = await getUserRoutesApi(1) // applicationId = 1
        if (routeRes.success && routeRes.data) {
          const rawRoutes = routeRes.data.routerList || []

          // 将后端返回的 VueRouter 数据转换为前端菜单结构
          const transformRoutesToMenus = (routes: any[]): any[] => {
            /**
             * 从路由记录解析出前端使用的 page 名称
             * - 优先使用 route.page
             * - 其次使用 route.component / route.meta.component
             * - 对于后端返回的 "/basic/.../index"、"/basic/.../Edit" 等，取最后一段作为 page
             * - 对于 "LAYOUT"，不生成实际页面，仅作为分组存在
             */
            const getPageFromRoute = (route: any): string | undefined => {
              if (route.page) return route.page

              const rawComponent: string | undefined = route.component || route.meta?.component
              if (!rawComponent || rawComponent === 'LAYOUT') return undefined

              if (rawComponent.includes('/basic/user/')) {
                return 'User'
              }
              if (rawComponent.includes('/basic/system/baseRole/')) {
                return 'Role'
              }
              if (rawComponent.includes('/basic/system/') || rawComponent.includes('/basic/msg/')) {
                return 'Home'
              }

              let comp = rawComponent
              // 去掉可能的前缀，例如 src/views/、views/、page/、/basic/
              comp = comp.replace(/^\/?src\/views\//, '')
              comp = comp.replace(/^views\//, '')
              comp = comp.replace(/^page\//, '')
              comp = comp.replace(/^\/?basic\//, '')

              const segments = comp.split('/')
              let last = segments[segments.length - 1] || ''

              // 去掉 .vue 后缀
              if (last.endsWith('.vue')) {
                last = last.slice(0, -4)
              }
              return last || undefined
            }

            const normalizePath = (path: string | undefined, page: string): string => {
              // Home 页特殊处理：保持为 "home"
              if (page === 'Home') {
                if (!path || path === '/' || path === '/home' || path === 'home') {
                  return 'home'
                }
              }

              const p = path || `/${page}`
              return p.startsWith('/') ? p : `/${p}`
            }

            const loop = (list: any[]): any[] => {
              const result: any[] = []

              list.forEach((route) => {
                const meta = route.meta || {}
                const hideMenu = meta.hideMenu === true
                const hideChildrenInMenu = meta.hideChildrenInMenu === true

                const page = getPageFromRoute(route)
                const path = page ? normalizePath(route.path, page) : route.path

                let children: any[] | undefined
                if (Array.isArray(route.children) && route.children.length && !hideChildrenInMenu) {
                  children = loop(route.children)
                  if (!children.length) children = undefined
                }

                // 当前节点隐藏菜单，仅提升子节点
                if (hideMenu) {
                  if (children) {
                    result.push(...children)
                  }
                  return
                }

                // LAYOUT 等仅作为分组存在且没有子节点时，直接忽略
                if (!page && (!children || !children.length)) {
                  return
                }

                const menu: any = {
                  id: route.id ? String(route.id) : undefined,
                  path: page ? path : undefined, // 分组节点不需要 path
                  // 菜单显示名称优先使用 meta.title
                  name: meta.title || route.name || page,
                  page,
                  icon: route.icon || meta.icon,
                  hideMenu,
                  hideChildrenInMenu
                }

                if (children) {
                  menu.children = children
                }

                result.push(menu)
              })

              return result
            }

            return loop(routes)
          }

          this.loginInfo.menus = transformRoutesToMenus(rawRoutes)
          // 同步权限资源与角色信息
          this.loginInfo.auths = (routeRes.data.resourceList || []).map((code: string) => ({ auth: code }))
          this.loginInfo.roles = (routeRes.data.roleList || []).map((code: string) => ({ name: code, code }))

          console.log('✅ 动态路由初始化完成:', {
            rawRoutes,
            menus: this.loginInfo.menus,
            resourceList: routeRes.data.resourceList,
            roleList: routeRes.data.roleList
          })

          // 设置动态路由
          setRoutes(this.loginInfo.menus)
        }

        return true
      } catch (error) {
        console.error('初始化用户信息失败:', error)
        return false
      }
    },

    setLoginInfo(loginInfo: any) {
      this.loginInfo = loginInfo
      /*设置动态路由*/
      setRoutes(loginInfo.menus)
    },

    setUser(user: any) {
      this.loginInfo.sysUser = JSON.parse(JSON.stringify(user))
    },

    /**
     * 退出登录
     */
    async logout() {
      try {
        if (this.loginInfo.token) {
          await logoutApi({
            token: this.loginInfo.token,
            refreshToken: this.loginInfo.refreshToken || ''
          })
        }
      } catch (error) {
        console.error('退出登录失败:', error)
      } finally {
        // 将状态重置为初始状态
        this.$reset()
        //删除localStorage中的用户信息
        localStorage.removeItem('localUserInfo')
        router.push('/login').then(() => {
          //重置路由
          resetRouter()
        })
      }
    }
  },
  //开启数据持久化
  persist: true
})
