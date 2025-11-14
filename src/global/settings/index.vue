<template>
  <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
    <template #trigger>
      <n-icon :size="24" @click="showDrawer"><Settings /></n-icon>
    </template>
    {{ t('settings') }}
  </n-tooltip>

  <n-drawer style="border-radius: 10px 0 0 10px" v-model:show="active" :width="350">
    <n-drawer-content :title="t('settings')" closable :native-scrollbar="false">
      <!--全局设置内容-->
      <Content
        @saveSettings="(args) => (Form = args)"
        @alertOff="showWarn = false"
        @showKeyDown="handleKeyDown"
        :show-warn="showWarn"
        :warn="warn" />
      <template #footer>
        <n-button style="width: 100%" :loading="loadingBut" secondary :type="butType" @click="save(Form, $event)">
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
import { AlertCircle, CircleCheck, Settings } from '@vicons/tabler'
import { i18n } from '@/i18n'
import Content from './content.vue'
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores/main'
import { globalSettings } from '@/stores/global-settings'
import Mitt from '@/utils/Bus'
import { delay, isEqual } from 'lodash-es'
import { globalSetting } from '@/services/types'
import { useBase } from '@/hooks/useBase'

const { t } = i18n.global
const active = ref(false)
const { textChange, butText, butType, butIcon, iconShow, showWarn, warn, loadingBut } = useBase()
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
  Form.theme['aside'].status = ASIDE_COLOR.value
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
  return keys.every((key) => modifierKeys.has(key))
}
/*保存设置*/
const save = (val: globalSetting, event: MouseEvent) => {
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
  loadingBut.value = true
  delay(() => {
    loadingBut.value = false
    /*View Transitions API来实现主图切换效果*/
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    let isDark: boolean
    /*判断当前浏览器是否支持View Transition API*/
    // TODO 遇到表格数据多的时候会卡顿一下 (nyh-2023-12-02 06:48:52)
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        const root = document.documentElement
        isDark = root.classList.contains('dark')
        root.classList.remove(isDark ? 'dark' : 'light')
        root.classList.add(isDark ? 'light' : 'dark')
      })
      transition.ready.then(() => {
        const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
        document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath
          },
          {
            duration: 500,
            easing: 'ease-in',
            pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
          }
        )
        /*防止保存后二次保存的错误*/
        if (!val.theme['aside'].status && val.theme['eye'].status) {
          ASIDE_COLOR.value = val.theme['aside'].status
          Form.theme['aside'].status = val.theme['aside'].status
        }
        /*是否修改的是护眼主题*/
        if (val.theme['eye'].status !== EYE_THEME.value) {
          active.value = false
          /*跟随动画结束后更新主题*/
          EYE_THEME.value = val.theme['eye'].status
          DISABLED.value = val.theme['eye'].status
          Form.theme['eye'].status = val.theme['eye'].status
          store.toggleTheme()
        }
        /*是否修改的是侧边栏的颜色*/
        if (val.theme['aside'].status !== ASIDE_COLOR.value) {
          ASIDE_COLOR.value = val.theme['aside'].status
          Form.theme['aside'].status = val.theme['aside'].status
          store.toggleAside()
        }
      })
    }
    Form.tags['search'].item = [...val.tags['search'].item]
    Form.tags['search'].double = val.tags['search'].double
    settingsStore.setSettings({ ...val })
    showWarn.value = false
    /*使用mitt给兄弟组件更新*/
    Mitt.emit('search', Form.tags['search'])
    textChange(t('save_success'), CircleCheck)
  }, 800)
}
</script>

<style lang="scss">
@use '@/styles/scss/layout-header';
@use '@/styles/scss/toggle-theme';
</style>
