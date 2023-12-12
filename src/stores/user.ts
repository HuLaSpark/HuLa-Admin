import { defineStore } from 'pinia'
import router, { resetRouter, setRoutes } from '@/router'
import type { IState } from '@/interface/IState'

export const userStore = defineStore('localUserInfo', {
  state: (): IState =>
    <IState>{
      loginInfo: {}
    },
  getters: {
    getUserId(): any {
      return this.loginInfo.sysUser ? this.loginInfo.sysUser.id : 0
    },
    getUserUId(): any {
      return this.loginInfo.sysUser ? this.loginInfo.sysUser.uid : 0
    },
    getTenantId(): any {
      return this.loginInfo.sysUser ? this.loginInfo.sysUser.tenantId : 0
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
      return this.loginInfo.auths.length ? this.loginInfo.auths.map((v) => v.auth) : []
    },
    getRole(): any {
      return this.loginInfo.sysUser.role || ''
    },
    getCompanyName(): any {
      return this.loginInfo.companyName || ''
    }
  },
  actions: {
    setLoginInfo(loginInfo: any) {
      this.loginInfo = loginInfo
      /*设置动态路由*/
      setRoutes(loginInfo.menus)
    },
    setUser(user: any) {
      this.loginInfo.sysUser = JSON.parse(JSON.stringify(user))
    },
    logout() {
      // 将状态重置为初始状态
      this.$reset()
      //删除localStorage中的用户信息
      localStorage.removeItem('localUserInfo')
      router.push('/login').then(() => {
        //重置路由
        resetRouter()
      })
    }
  },
  //开启数据持久化
  persist: true
})
