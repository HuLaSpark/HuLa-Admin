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
        <n-button style="width: 100%" :loading="loading" secondary :type="butType as any" @click="save(Form)">
          <template #icon>
            <n-icon v-if="iconShow" :component="butIcon" />
          </template>
          {{ butText }}
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { Settings, CircleCheck, AlertCircle } from '@vicons/tabler'
import { i18n } from '@/i18n'
import Content from './content.vue'
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores/main'
import { globalSettings } from '@/stores/global-settings'
import Mitt from '@/utils/Bus'
import { delay, isEqual } from 'lodash-es'
import { globalSetting } from '@/services/types'

const { t } = i18n.global
const active = ref(false)
const butText = ref()
const butType = ref('primary')
const butIcon = shallowRef<object>(CircleCheck)
const iconShow = ref(false)
const store = mainStore()
const { EYE_THEME, ASIDE_COLOR, DISABLED } = storeToRefs(store)
const settingsStore = globalSettings()
const { data } = storeToRefs(settingsStore)
const Form = reactive<globalSetting>({
  theme: {
    eye: { status: false },
    aside: { status: false }
  },
  tags: { search: { item: ['Shift'], double: true } }
})
const loading = ref(false)
const warn = ref()
const showWarn = ref(false)

/*监听国际化切换时实时切换语言*/
watchEffect(() => {
  butText.value = t('save')
})

/*处理设置中不规范的问题*/
const handleKeyDown = (content: string) => {
  showWarn.value = true
  warn.value = content
}
/*显示设置抽屉*/
const showDrawer = () => {
  active.value = true
  showWarn.value = false
  Form.theme['eye'].status = EYE_THEME.value
  if (Object.keys(data.value).length === 0) {
    settingsStore.setSettings({ ...(Form as any) })
  }
  Form.tags['search'].item = [...data.value.tags['search'].item]
  Form.tags['search'].double = data.value.tags['search'].double
}
/*判断是否只包含修饰键*/
const containsOnlyModifiers = (keys: string[]): boolean => {
  if (keys.length === 0) return false
  const modifierKeys = new Set(['Control', 'Shift', 'Alt', 'Meta', 'CapsLock'])
  // 检查第一个键是否是修饰键
  if (!modifierKeys.has(keys[0])) return true
  for (const key of keys) {
    if (!modifierKeys.has(key)) {
      return false // 包含了非修饰键
    }
  }
  return true // 只包含修饰键
}
/*保存设置*/
const save = (val: globalSetting) => {
  const isOnlyModifiers = containsOnlyModifiers([...val.tags['search'].item])
  if (isOnlyModifiers && !val.tags['search'].double) {
    showWarn.value = true
    warn.value = '要以修饰键开头并且不能只包含修饰键，可以试着启动连按'
    textChange(t('save_warning'), AlertCircle, 'warning')
    return
  }
  if (isEqual({ ...val }, { ...Form })) {
    showWarn.value = true
    warn.value = t('alert_warning_description')
    textChange(t('save_warning'), AlertCircle, 'warning')
    return
  }
  loading.value = true
  delay(() => {
    loading.value = false
    /*防止保存后二次保存的错误*/
    if (!val.theme['aside'].status && val.theme['eye'].status) {
      ASIDE_COLOR.value = val.theme['aside'].status
      Form.theme['aside'].status = val.theme['aside'].status
    }
    /*需要判断是否修改的是主题*/
    if (val.theme['eye'].status !== EYE_THEME.value) {
      EYE_THEME.value = val.theme['eye'].status
      DISABLED.value = val.theme['eye'].status
      Form.theme['eye'].status = val.theme['eye'].status
      store.toggleTheme()
    }
    if (val.theme['aside'].status !== ASIDE_COLOR.value) {
      ASIDE_COLOR.value = val.theme['aside'].status
      Form.theme['aside'].status = val.theme['aside'].status
      store.toggleAside()
    }
    Form.tags['search'].item = [...val.tags['search'].item]
    Form.tags['search'].double = val.tags['search'].double
    settingsStore.setSettings({ ...val })
    showWarn.value = false
    /*使用mitt给兄弟组件更新*/
    Mitt.emit('search', Form.tags['search'])
    textChange(t('save_success'), CircleCheck)
  }, 1000)
}
/*处理保存按钮的提示*/
const textChange = (text: string, icon?: object, type?: string) => {
  butText.value = text
  iconShow.value = true
  icon ? (butIcon.value = icon) : {}
  type ? (butType.value = type) : ''
  delay(() => {
    butText.value = t('save')
    butType.value = 'primary'
    iconShow.value = false
  }, 2000)
}
</script>

<style scoped>
@import '@/assets/css/layout-header.css';
</style>
