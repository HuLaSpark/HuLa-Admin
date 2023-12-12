import { defineStore } from 'pinia'
import router from '@/router/index'

type Tab = {
  data: {
    [key: string]: {
      title: string
      path: string
      icon: string
    }
  }
}
export const tabs = defineStore('tabs', {
  state: (): Tab =>
    <Tab>{
      data: {}
    },
  actions: {
    addTab(tab: Tab) {
      /*添加标签页的时候排除home路由*/
      if ((tab.data.path as any) === 'home') return
      this.data = {
        ...this.data,
        [tab.data.path as any]: {
          title: tab.data.title,
          path: tab.data.path,
          icon: tab.data.icon
        }
      }
    },
    removeTab(path: string) {
      this.data = Object.fromEntries(Object.entries(this.data).filter(([key]) => key !== path))
      if (Object.keys(this.data).length === 0) {
        router.push('/home')
      }
    },
    resetState() {
      // 将状态重置为初始状态
      this.$reset()
      //删除标签页
      localStorage.removeItem('tabs')
    }
  },
  //开启数据持久化
  persist: true
})
