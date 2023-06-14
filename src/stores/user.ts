import {defineStore} from "pinia";
import router, {resetRouter, setRoutes} from "@/router";
import type {IState} from "@/interface/IState";

export const userStore = defineStore('localUserInfo',{
    state:():IState =><IState>({
        loginInfo: {}
    }),
    getters: {
        getUserId():any {
            return this.loginInfo.user ? this.loginInfo.user.id : 0
        },
        getUserUId():any {
            return this.loginInfo.user ? this.loginInfo.user.uid : 0
        },
        getUser():any {
            return this.loginInfo.user || {}
        },
        getBearerToken():any {
            return this.loginInfo.token ? 'Bearer ' + this.loginInfo.token : ''
        },
        getToken():any {
            return this.loginInfo.token || ""
        },
        getMenus():any {
            return this.loginInfo.menus || []
        },
        getAuths():any {
            return this.loginInfo.auths.length ? this.loginInfo.auths.map(v =>v.auth) : []
        },
        getRole():any {
            return this.loginInfo.user.role || ""
        }

    },
    actions:{
        setLoginInfo(loginInfo:any) {
            this.loginInfo = loginInfo
            /*设置动态路由*/
            setRoutes(loginInfo.menus)
        },
        setUser(user:any) {
            this.loginInfo.user = JSON.parse(JSON.stringify(user))
        },
        logout() {
            //删除localStorage中的用户信息
            localStorage.removeItem('localUserInfo')
            router.push('/login')
            //重置路由
            resetRouter()
        }
    },
    //开启数据持久化
    persist: true
})
