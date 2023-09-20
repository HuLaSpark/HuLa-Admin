import { defineStore } from 'pinia'

export const language = defineStore('language', {
  state: () => ({
    locale: 'zh-CN'
  }),
  getters: {},
  actions: {
    setChinese() {
      this.locale = 'zh-CN'
    },
    setEnglish() {
      this.locale = 'en-US'
    }
  },
  //开启数据持久化
  persist: true
})
