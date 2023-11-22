import { defineStore } from 'pinia'

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
    }
  },
  //开启数据持久化
  persist: true
})
