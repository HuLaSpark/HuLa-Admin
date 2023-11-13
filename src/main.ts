import { createApp } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'animate.css'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/stores/index'
import { i18n } from '@/i18n'
import { pkgJson } from '@/views/composables/aboutUs/model'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
pinia.use(piniaPluginPersistedstate)
app.mount('#app')
const { version } = pkgJson
console.log(
  `%c🎉 HuLa ${version}`,
  'font-size:20px; background:#FFF; color:#581845;padding:10px; border: 3px solid #581845;border-radius:10px;'
)
const scaleWidth = window.screen.width / 1920
const scaleHeight = window.screen.height / 1080
const scale = Math.min(scaleWidth, scaleHeight)
const metaEl = document.querySelector('meta[name="viewport"]')
if (metaEl) {
  metaEl.setAttribute(
    'content',
    `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}, user-scalable=no, viewport-fit=cover`
  )
} else {
  console.error('Viewport meta tag not found')
}
