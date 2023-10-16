import { defineStore } from 'pinia'
interface Settings {
  data: {
    themeStatus: boolean
    tags: {
      [key: string]: {
        item: string[]
        double: boolean
      }
    }
  }
}
export const globalSettings = defineStore('global-Settings', {
  state: (): Settings =>
    <Settings>{
      data: {}
    },
  getters: {
    getSettings(): Settings | object {
      return this.data || {}
    },
    getSettingsTags(): Settings | object {
      return this.data.tags || {}
    }
  },
  actions: {
    setSettings(val: Settings) {
      this.data = JSON.parse(JSON.stringify(val))
    }
  },
  persist: true
})
