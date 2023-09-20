<template>
  <div class="operation-list-box">
    <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
      <template #trigger>
        <n-icon :size="24" @click="showDrawer"><Settings /></n-icon>
      </template>
      {{ t('settings') }}
    </n-tooltip>
  </div>

  <n-drawer v-model:show="active" :width="drawerWidth">
    <n-drawer-content :title="t('settings')" closable>
      <Content @saveSettings="(args) => (Form = args)" :show-warn="showWarn" :warn="warn" />
      <template #footer>
        <n-button style="width: 100%" :loading="loading" secondary type="primary" @click="save(Form)">{{
          t('save')
        }}</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { Settings } from '@vicons/tabler'
import { i18n } from '@/i18n'
import Content from './content.vue'
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores/main'

const { t, locale } = i18n.global
const active = ref(false)
const store = mainStore()
const { THEME } = storeToRefs(store)
const Form = reactive({
  themeStatus: false,
  test: false
})
const loading = ref(false)
const drawerWidth = ref()
const warn = ref()
const showWarn = ref(false)

const showDrawer = () => {
  active.value = true
  showWarn.value = false
  Form.themeStatus = THEME.value
}
const save = (val: any) => {
  if (JSON.stringify(val) === JSON.stringify(Form)) {
    showWarn.value = true
    warn.value = '表单内容没有修改'
    return false
  } else if (JSON.stringify(val.themeStatus) === JSON.stringify(Form.themeStatus)) {
    showWarn.value = true
    warn.value = '主题没有修改'
    return false
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    THEME.value = val.themeStatus
    Form.themeStatus = val.themeStatus
    showWarn.value = false
    store.toggleTheme()
  }, 1000)
}

watchEffect(() => {
  /*监听drawer的宽度跟随语言切换而改变*/
  drawerWidth.value = locale.value === 'zh-CN' ? 350 : 420
})
</script>

<style scoped>
@import '@/assets/css/layout-header.css';
</style>
