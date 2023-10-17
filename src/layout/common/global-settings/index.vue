<template>
  <div class="operation-list-box">
    <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
      <template #trigger>
        <n-icon :size="24" @click="showDrawer"><Settings /></n-icon>
      </template>
      {{ t('settings') }}
    </n-tooltip>
  </div>

  <n-drawer style="border-radius: 10px 0 0 10px" v-model:show="active" :width="350">
    <n-drawer-content :title="t('settings')" closable :native-scrollbar="false">
      <Content
        @saveSettings="(args) => (Form = args)"
        @alertOff="showWarn = false"
        @showKeyDown="handleKeyDown"
        :show-warn="showWarn"
        :warn="warn" />
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
import { globalSettings } from '@/stores/global-settings'
import Mit from '@/utils/Bus'

const { t } = i18n.global
const active = ref(false)
const store = mainStore()
const { THEME } = storeToRefs(store)
const settingsStore = globalSettings()
const { data } = storeToRefs(settingsStore)
const Form = reactive<{
  themeStatus: boolean
  tags: {
    [key: string]: {
      item: string[]
      double: boolean
    }
  }
}>({
  themeStatus: false,
  tags: { search: { item: ['Shift'], double: false } }
})
const loading = ref(false)
const warn = ref()
const showWarn = ref(false)
/*处理设置中不规范的问题*/
const handleKeyDown = (content: string) => {
  showWarn.value = true
  warn.value = content
}
const showDrawer = () => {
  active.value = true
  showWarn.value = false
  Form.themeStatus = THEME.value
  if (Object.keys(data.value).length === 0) {
    settingsStore.setSettings({ ...(Form as any) })
  }
  Form.tags['search'].item = [...data.value.tags['search'].item]
  Form.tags['search'].double = data.value.tags['search'].double
}
/*判断是否只包含修饰键*/
const containsOnlyModifiers = (keys: string[]): boolean => {
  const modifierKeys = new Set(['Control', 'Shift', 'Alt', 'Meta', 'CapsLock'])
  for (const key of keys) {
    if (!modifierKeys.has(key)) {
      return false // 包含了非修饰键
    }
  }
  return true // 只包含修饰键
}

const save = (val: any) => {
  const isOnlyModifiers = containsOnlyModifiers([...val.tags['search'].item])
  if (isOnlyModifiers && val.tags['search'].double === false) {
    showWarn.value = true
    warn.value = '不能只包含修饰键'
    return
  }
  if (JSON.stringify({ ...val }) === JSON.stringify({ ...Form })) {
    showWarn.value = true
    warn.value = t('alert_warning_description')
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    /*需要判断是否修改的是主题*/
    if (val.themeStatus !== THEME.value) {
      THEME.value = val.themeStatus
      Form.themeStatus = val.themeStatus
      store.toggleTheme()
    }
    Form.tags['search'].item = [...val.tags['search'].item]
    Form.tags['search'].double = val.tags['search'].double
    settingsStore.setSettings({ ...val })
    showWarn.value = false
    /*使用mitt给兄弟组件更新*/
    Mit.emit('search', Form.tags['search'])
  }, 1000)
}
</script>

<style scoped>
@import '@/assets/css/layout-header.css';
</style>
