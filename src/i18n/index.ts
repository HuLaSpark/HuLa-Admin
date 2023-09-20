import { createI18n } from 'vue-i18n'
import zhCN from '@/i18n/zh-CN.json'
import enUS from '@/i18n/en-US.json'

const languageObject = JSON.parse(String(localStorage.getItem('language')))
export const i18n = createI18n({
  /*默认为中文*/
  locale: languageObject?.locale ? languageObject.locale : 'zh-CN',
  fallbackLocale: 'en-US',
  legacy: false, //要对legacy进行配置不然会报 Uncaught SyntaxError: Not available in legacy mode
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})
