import { defineStore } from 'pinia'

export const mainStore = defineStore('main', {
  state: () => {
    return {
      /*登录页面背景颜色*/
      LOGIN_BGC: '#FFF',
      /*背景颜色*/
      BGC: '#FFF',
      /*背景剩余部分的颜色*/
      BGC_OTHER: '#f4f4f4',
      /*菜单栏的按钮颜色*/
      BTN: 'rgb(229, 243, 237)',
      /*文本的颜色*/
      TEXT_COLOR: '#000',
      /*是否切换主题*/
      THEME: false
    }
  },
  getters: {},
  actions: {
    toggleTheme() {
      this.THEME = !!this.THEME
      this.BGC = this.BGC === '#FFF' ? '#18181c' : '#FFF'
      this.LOGIN_BGC = this.LOGIN_BGC === '#FFF' ? '#141414' : '#FFF'
      this.BTN = this.BTN === 'rgb(229, 243, 237)' ? 'rgba(229, 243, 237, .1)' : 'rgb(229, 243, 237)'
      this.BGC_OTHER = this.BGC_OTHER === '#f4f4f4' ? '#1d1d1d' : '#f4f4f4'
      this.TEXT_COLOR = this.TEXT_COLOR === '#000' ? '#cdd1da' : '#000'
    }
  },
  //开启数据持久化
  persist: true
})
