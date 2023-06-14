import { createApp } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'animate.css';
import App from '@/App.vue'
import router from "@/router"
import pinia from '@/stores/index'
import {i18n} from '@/i18n'


const app = createApp(App)
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
