<template>
  <div :class="collapsed ? 'header-unfold' : 'header-shrink'">
    <div class="operation-list">
      <!--全局搜索-->
      <GlobalSearch />
      <n-divider vertical />
      <!--首页-->
      <div class="operation-list-box">
        <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
          <template #trigger>
            <n-icon :size="24"><DeviceDesktop /></n-icon>
          </template>
          {{ t('home') }}
        </n-tooltip>
      </div>
      <n-divider vertical />
      <!--全屏-->
      <div class="operation-list-box">
        <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
          <template #trigger>
            <n-icon :size="24" @click="handleMaximize"><Maximize /></n-icon>
          </template>
          {{ t('full_screen') }}
        </n-tooltip>
      </div>
      <n-divider vertical />
      <!--切换语言组件-->
      <Language />
      <n-divider vertical />
      <!--终端-->
      <div class="operation-list-box">
        <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
          <template #trigger>
            <n-icon :size="24" @click="handleTerminal"><Terminal2 /></n-icon>
          </template>
          {{ t('terminal') }}
        </n-tooltip>
      </div>
      <n-divider vertical />
      <!--清理缓存-->
      <div class="operation-list-box">
        <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
          <template #trigger>
            <n-icon :size="24"><Trash /></n-icon>
          </template>
          {{ t('delete_cache') }}
        </n-tooltip>
      </div>
      <n-divider vertical />
      <!--	头像	-->
      <div class="operation-list-box">
        <n-popover trigger="hover" placement="bottom" :width="250">
          <template #trigger>
            <n-badge :type="networkIcon" dot processing>
              <n-avatar :size="34" :src="url" style="border-radius: 8px" />
            </n-badge>
          </template>
          <template #header>
            <n-text depth="1">
              <n-space vertical>
                <n-tag class="info-tag" size="small" round :bordered="false" :type="judgmentAuth(role)">{{
                  roleName
                }}</n-tag>
                <div class="info-content">
                  <n-avatar :size="64" :src="url" style="border-radius: 8px" />
                  <div>
                    <span>{{ userName }}</span>
                    <div>{{ email }}</div>
                  </div>
                </div>
              </n-space>
            </n-text>
          </template>
          内容
          <template #footer>
            <div style="display: flex; justify-content: space-between">
              <n-button quaternary type="tertiary"> 个人信息 </n-button>
              <n-tooltip trigger="hover" content-style="padding: 0">
                <template #trigger>
                  <n-popconfirm :positive-text="t('confirm')" :negative-text="t('cancel')" @positive-click="userExit">
                    <template #icon>
                      <n-icon color="#e86060"><AlertTriangle /></n-icon>
                    </template>
                    <template #trigger>
                      <n-button secondary round circle type="error">
                        <template #icon>
                          <n-icon><Power /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ t('out_confirm') }}
                  </n-popconfirm>
                </template>
                {{ t('logout') }}
              </n-tooltip>
            </div>
          </template>
        </n-popover>
      </div>
      <n-divider vertical />
      <!-- 设置组件 -->
      <Settings />
    </div>
  </div>
  <!--终端弹框-->
  <n-modal
    v-model:show="showModal"
    title="终端"
    :mask-closable="false"
    style="width: 650px; height: 650px"
    :show-icon="false"
    preset="card">
    <Terminal />
  </n-modal>
</template>

<script setup lang="ts">
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { userStore } from '@/stores/user'
import { DeviceDesktop, Maximize, Trash, Terminal2, Power, AlertTriangle } from '@vicons/tabler'
import { i18n } from '@/i18n'
import Language from '@/components/Language/index.vue'
import Terminal from '@/components/terminal/index.vue'
import Settings from '@/layout/common/global-settings/index.vue'
import screenfull from 'screenfull'
import { useLogin } from '@/hooks/useLogin'
import { useAuth } from '@/hooks/useAuth'
import { Loading } from 'notiflix'
import { delay } from 'lodash-es'
import GlobalSearch from '@/layout/common/global-search/index.vue'

const { t } = i18n.global
const message = useMessage()
const store = mainStore()
const userInfoStore = userStore()
const user = userInfoStore.getUser
const roleName = userInfoStore.getRoleName
const { uid, userName, email, role, url } = user
const { BGC, TEXT_COLOR } = storeToRefs(store)
const showModal = ref(false)

const { navigator } = window
const networkIcon = ref()
const { judgmentAuth } = useAuth()

/*获取父组件传来的值*/
const { collapsed } = defineProps<{
  collapsed: boolean
}>()
/*判断当前网络状态*/
window.addEventListener('online', () => {
  console.log('设备已连接网络')
  networkIcon.value = 'success'
})
window.addEventListener('offline', () => {
  message.error(t('network_state'))
  networkIcon.value = 'error'
})
watchEffect(() => {
  networkIcon.value = navigator.onLine ? 'success' : 'error'
})

/*全屏功能*/
const handleMaximize = () => {
  if (!screenfull.isEnabled) {
    message.error('当前浏览器不支持全屏')
    return false
  }
  screenfull.toggle()
}
/*打开终端*/
const handleTerminal = () => {
  showModal.value = true
}

/*用户退出*/
const userExit = () => {
  Loading.hourglass()
  delay(() => {
    Loading.remove()
    userInfoStore.logout()
    useLogin().exit(uid)
  }, 500)
}
</script>

<style scoped>
@import '@/assets/css/layout-header.css';
.header-unfold {
  background-color: v-bind(BGC);
}
.header-shrink {
  background-color: v-bind(BGC);
}
.operation-list {
  color: v-bind(TEXT_COLOR);
}
.info-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
.info-content span {
  font-weight: bold;
}
.info-tag {
  display: flex;
  justify-content: center;
}
</style>
