import { defineStore } from 'pinia'
import { globalSetting } from '@/services/types'
type Settings = {
  data: globalSetting
}
export const globalSettings = defineStore('global-Settings', {
  state: (): Settings =>
    <Settings>{
      data: {}
    },
  getters: {
    getSettings(): globalSetting | object {
      return this.data || {}
    },
    getSettingsTags(): globalSetting | object {
      return this.data.tags || {}
    }
  },
  actions: {
    setSettings(val: globalSetting) {
      this.data = JSON.parse(JSON.stringify(val))
    }
  },
  persist: true
})
