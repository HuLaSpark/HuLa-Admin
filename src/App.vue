<template>
  <n-config-provider :theme="theme" :locale="NLanguage" :date-locale="NDataLanguage">
    <div id="app">
      <n-notification-provider :max="3">
        <n-message-provider :max="3">
          <router-view />
        </n-message-provider>
      </n-notification-provider>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { darkTheme, dateZhCN, zhCN } from 'naive-ui'

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

<style lang="scss">
@import '@/styles/scss/global-app';
#app {
  background-color: v-bind(LOGIN_BGC);
}
</style>
