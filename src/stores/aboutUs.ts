import { defineStore } from 'pinia'
import type { IAboutUs } from '@/interface/IAboutUs'

export const aboutUs = defineStore('aboutUs', {
  state: (): { data: IAboutUs } => ({
    data: {}
  }),
  getters: {
    getAboutUs(): IAboutUs {
      return this.data || {}
    }
  },
  actions: {
    /*需要在actions中定义需要参数的get*/
    getShow(key: string): boolean {
      return this.data[key].show || false
    },
    setAboutUs(key: string, title: string, show: boolean) {
      // 如果没有值就设置值
      if (!this.data[key]) {
        // 设置默认值，只有在键不存在时才设置默认值
        this.$patch({ data: { [key]: { title: title, show: show } } })
      } else {
        // 仅在键存在时更新属性
        this.data[key].title = JSON.parse(JSON.stringify(title))
        this.data[key].show = JSON.parse(JSON.stringify(show))
      }
    },
    deleteAboutUs() {
      localStorage.removeItem('aboutUs')
    }
  },
  persist: true
})
