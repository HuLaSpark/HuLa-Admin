<template>
  <n-config-provider :theme="theme" :locale="NLanguage" :date-locale="NDataLanguage">
    <div id="app">
      <n-notification-provider :max="3">
        <n-message-provider :max="6">
          <router-view />
          <Verify />
        </n-message-provider>
      </n-notification-provider>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { darkTheme } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
import Verify from '@/components/modal/timeout/verifyModal.vue' /*导入用户超时未操作是的验证模态框*/

const store = mainStore()
const NLanguage = ref(zhCN)
const NDataLanguage = ref(dateZhCN)
provide('NLanguage', NLanguage)
provide('NDataLanguage', NDataLanguage)
const { EYE_THEME, LOGIN_BGC } = storeToRefs(store)
const theme = ref<any>(EYE_THEME.value)
/*监听深色主题颜色变化*/
watchEffect(() => {
  theme.value = EYE_THEME.value ? darkTheme : null
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  transition: all 0.9s ease;
  background-color: v-bind(LOGIN_BGC);
}
</style>
