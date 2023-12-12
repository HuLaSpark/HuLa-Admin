import { defineStore } from 'pinia'
import type { IRemember } from '@/interface/IRemember'

export const remember = defineStore('remember', {
  state: (): IRemember =>
    <IRemember>{
      remember: {}
    },
  getters: {
    getRemember(): any {
      return this.remember || ''
    }
  },
  actions: {
    setRememberUser(user: IRemember, rememberMe: boolean) {
      this.remember = JSON.parse(JSON.stringify(user))
      this.remember.rememberMe = rememberMe
    },
    deleteRemember() {
      this.remember = {}
      this.$reset()
      //删除localStorage中记住的信息
      localStorage.removeItem('remember')
    }
  },
  //开启数据持久化
  persist: true
})
