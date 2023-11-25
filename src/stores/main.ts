import { defineStore } from 'pinia'

export const mainStore = defineStore('main', {
  state: () => {
    return {
      /*登录页面背景颜色*/
      LOGIN_BGC: '#FFF',
      /*侧边栏颜色*/
      ASIDE_BGC: '#FFF',
      /*背景颜色*/
      BGC: '#FFF',
      /*背景剩余部分的颜色*/
      BGC_OTHER: '#f4f4f4',
      /*遮罩层的颜色*/
      MASK_BGC: 'rgba(231, 229, 228, 0.75)',
      /*菜单栏的按钮颜色*/
      BTN: 'rgb(229, 243, 237)',
      /*tabs选中时的背景颜色*/
      TAB_ACTIVE_BGC: '#e5f3ec',
      /*hover时的背景颜色*/
      HOVER_BGC: 'rgba(60, 60, 60, 0.2)',
      /*文本的颜色*/
      TEXT_COLOR: '#000',
      /*侧边栏文本颜色*/
      ASIDE_TEXT_COLOR: '#000',
      /*是否切换护眼主题*/
      EYE_THEME: false,
      /*是否切换侧边栏颜色*/
      ASIDE_COLOR: false,
      /*是否禁用*/
      DISABLED: false
    }
  },
  getters: {},
  actions: {
    toggleTheme() {
      this.EYE_THEME = !!this.EYE_THEME
      this.DISABLED = this.EYE_THEME
      this.BGC = this.BGC === '#FFF' ? '#18181c' : '#FFF'
      this.ASIDE_BGC = this.BGC
      this.LOGIN_BGC = this.LOGIN_BGC === '#FFF' ? '#141414' : '#FFF'
      this.BTN = this.BTN === 'rgb(229, 243, 237)' ? 'rgba(229, 243, 237, .1)' : 'rgb(229, 243, 237)'
      this.MASK_BGC = this.EYE_THEME ? 'rgba(41, 37, 36, 0.75)' : 'rgba(231, 229, 228, 0.75)'
      this.TAB_ACTIVE_BGC = this.EYE_THEME ? '#233633' : '#e5f3ec'
      this.HOVER_BGC = this.EYE_THEME ? 'rgba(255, 255, 255, 0.2)' : 'rgba(60, 60, 60, 0.2)'
      this.BGC_OTHER = this.BGC_OTHER === '#f4f4f4' ? '#1d1d1d' : '#f4f4f4'
      this.TEXT_COLOR = this.TEXT_COLOR === '#000' ? '#cdd1da' : '#000'
      this.ASIDE_TEXT_COLOR = this.TEXT_COLOR
    },
    toggleAside() {
      this.ASIDE_COLOR = !!this.ASIDE_COLOR
      this.ASIDE_BGC = this.ASIDE_BGC === '#FFF' ? '#001428' : '#FFF'
      this.ASIDE_TEXT_COLOR = this.ASIDE_TEXT_COLOR === '#000' ? '#cdd1da' : '#000'
    }
  },
  //开启数据持久化
  persist: true
})
