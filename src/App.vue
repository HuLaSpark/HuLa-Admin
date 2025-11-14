<template>
  <n-config-provider :theme="theme" :locale="NLanguage" :date-locale="NDataLanguage">
    <div id="app">
      <n-notification-provider :max="3">
        <n-message-provider :max="3">
          <n-dialog-provider>
            <n-loading-bar-provider>
              <Content />
            </n-loading-bar-provider>
          </n-dialog-provider>
        </n-message-provider>
      </n-notification-provider>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { darkTheme, dateZhCN, zhCN, useDialog, useMessage, useNotification, useLoadingBar } from 'naive-ui'
import { RouterView } from 'vue-router'

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

const Content = defineComponent({
  setup() {
    // 挂载全局 API 到 window
    window.$dialog = useDialog()
    window.$message = useMessage()
    window.$notification = useNotification()
    window.$loadingBar = useLoadingBar()
  },
  render() {
    return h(RouterView)
  }
})
</script>

<style lang="scss">
@use '@/styles/scss/global-app';
#app {
  background-color: v-bind(LOGIN_BGC);
}
</style>
