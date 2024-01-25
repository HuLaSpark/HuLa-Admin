import { mainStore } from '@/stores/main' import { storeToRefs } from 'pinia' import { userStore } from '@/stores/user'
import { AlertTriangle, ArrowsMaximize, ArrowsMinimize, Bell, Mail, Message2, Power, Terminal2, Trash } from
'@vicons/tabler' import { i18n } from '@/i18n' import Settings from '@/global/settings/index.vue' import screenfull from
'screenfull' import { useLogin } from '@/hooks/useLogin' import { Loading } from 'notiflix' import { delay } from
'lodash-es' import GlobalSearch from '@/global/search/index.vue' import { networkIcon } from '@/services/request' const
{ t } = i18n.global const message = useMessage() const store = mainStore() const userInfoStore = userStore() const user
= userInfoStore.getUser const { userName, email, url } = user const { BGC, TEXT_COLOR, BGC_OTHER } = storeToRefs(store)
const showModal = ref(false) const fullIcon = ref(false) const { navigator } = window /*获取父组件传来的值*/ const {
collapsed } = defineProps<{ collapsed: boolean }>() /*判断当前网络状态*/ window.addEventListener('online', () => {
console.log('设备已连接网络') networkIcon.value = 'success' }) window.addEventListener('offline', () => {
message.error(t('network_state')) networkIcon.value = 'error' }) watchEffect(() => { networkIcon.value =
navigator.onLine ? 'success' : 'error' }) /*全屏功能*/ const handleMaximize = () => { if (!screenfull.isEnabled) {
message.error('当前浏览器不支持全屏') return false } /*监听当前页面是否进入全屏状态*/
document.addEventListener('fullscreenchange', () => { fullIcon.value = !!document.fullscreenElement })
screenfull.toggle() } /*打开终端*/ const handleTerminal = () => { showModal.value = true } /*用户退出*/ const userExit =
() => { Loading.hourglass() delay(() => { Loading.remove() useLogin().exit() }, 500) }
