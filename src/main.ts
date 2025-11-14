import { createApp } from 'vue'
import 'animate.css'
import '@/styles/reset.css'
import App from '@/App.vue'
import router from '@/router'
import { pinia } from '@/stores'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { i18n } from '@/i18n'
// import VueDragResize from 'vue-drag-resize'
import drag from '@/directives/drag'
import { Common } from '@/utils/Common'

pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

window.$router = router

/*使用链式调用挂载*/
app.use(pinia).use(router).use(i18n).directive('drag', drag).mount('#app')
// app.component('vue-drag-resize', VueDragResize)
Common.consolePrint()
