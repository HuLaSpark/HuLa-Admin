<template>
  <n-space vertical class="container">
    <!--自定义警告-->
    <AlertIze
      img-url="./src/assets/svg/warning.svg"
      :enter-active="'animate__animated animate__bounceIn'"
      :leave-active="'animate__animated animate__fadeOutUp'"
      :title="t('warn')"
      :text="warn"
      :show="showWarn"
      @alertOff="alertOff" />

    <n-divider title-placement="center">
      <span>{{ t('theme') }}</span>
    </n-divider>

    <n-space vertical :size="20">
      <!--护眼模式-->
      <n-space justify="space-between" align="center">
        <p>{{ t('eye_shield') }}</p>
        <n-switch
          :rubber-band="false"
          :value="olForm.theme['eye'].status"
          :loading="EyeLoading"
          @update:value="switchEyeTheme">
          <template #checked-icon>
            <n-icon><Moon /></n-icon>
          </template>
          <template #unchecked-icon>
            <n-icon><Sun /></n-icon>
          </template>
          <template #checked>{{ t('dark_color') }}</template>
          <template #unchecked>{{ t('light_color') }}</template>
        </n-switch>
      </n-space>
      <!--侧边栏深色-->
      <n-space justify="space-between" align="center">
        <p>侧边栏深色</p>
        <n-switch
          :disabled="themeDisabled"
          :rubber-band="false"
          :value="olForm.theme['aside'].status"
          :loading="AsideLoading"
          @update:value="switchAsideTheme">
          <template #checked-icon>
            <n-icon><Check /></n-icon>
          </template>
          <template #unchecked-icon>
            <n-icon><X /></n-icon>
          </template>
          <template #checked>开启</template>
          <template #unchecked>关闭</template>
        </n-switch>
      </n-space>
    </n-space>

    <n-config-provider :theme="theme">
      <!--!小型预览主题布局-->
      <n-card class="example-box" :hoverable="true">
        <n-space justify="space-between" :size="5">
          <!--侧边栏-->
          <div class="preview-aside">
            <div class="aside-box">
              <img src="/logo.png" alt="" style="width: 15px; height: 12px" />
              <span style="font-size: 8px; transform: scale(1)">HuLa</span>
            </div>
          </div>
          <n-space vertical :size="5">
            <div class="preview-header"></div>
            <div class="preview-content"></div>
          </n-space>
        </n-space>
      </n-card>
    </n-config-provider>

    <n-divider title-placement="center">
      <span>{{ t('keys_binding') }}</span>
      <n-icon style="cursor: pointer" :component="Help" size="20" />
    </n-divider>
    <!--快捷键绑定-->
    <n-space justify="space-between" align="center">
      <p>全局搜索</p>
      <n-checkbox v-model:checked="olForm.tags['search'].double" @update:checked="handleChecked">启用连按</n-checkbox>
    </n-space>
    <n-dynamic-tags
      @keydown="handleKeyDown"
      @create="keyDownCreate"
      v-model:value="olForm.tags['search'].item"
      :render-tag="renderTag"
      :max="3">
      <template #trigger="{ activate, disabled }">
        <n-button
          style="border-radius: 8px"
          size="small"
          type="primary"
          dashed
          :disabled="disabled"
          @click="activate()">
          <template #icon><n-icon :component="KeyboardHide" /></template>
          {{ t('add') }}
        </n-button>
      </template>
    </n-dynamic-tags>
  </n-space>
</template>

<script setup lang="ts">
import { Check, Help, KeyboardHide, Moon, Sun, X } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { darkTheme, NTag } from 'naive-ui'
import { cloneDeep } from 'lodash-es'
import { AlertIze } from '@/customize'
import { globalSettings } from '@/stores/global-settings'
import { globalSetting } from '@/services/types'

const { t } = i18n.global
const store = mainStore()
/*切换开关加载状态组*/
const EyeLoading = ref(false)
const AsideLoading = ref(false)
const themeDisabled = ref(false) // 是否禁用

const { EYE_THEME, BGC, BGC_OTHER, ASIDE_BGC, ASIDE_COLOR, DISABLED, ASIDE_TEXT_COLOR } = storeToRefs(store)
const settingsStore = globalSettings()
const { data } = storeToRefs(settingsStore)
const olForm = reactive<globalSetting>({
  theme: {
    eye: { status: false },
    aside: { status: false }
  },
  tags: { search: { item: [], double: false } }
})
/*定义跟踪变化的副本对象*/
let form = shallowReactive(cloneDeep(olForm))
/*示例数据变量*/
const theme = ref()
const asideBgc = ref()
const asideTextColor = ref()
const bgc = ref()
const bgc_other = ref()

const emit = defineEmits(['saveSettings', 'alertOff', 'showKeyDown'])
// TODO 新版本3.3的defineProps解构例子 (nyh-2023-09-29 23:38:16)
/**
 * 使用旧版解构
 * const { warn, showWarn } = toRefs(props)
 * 如果需要使用默认值withDefaults的时候使用新版解构方式会报错
 * 新版vite.config开启解构语法可以直接解构并且具有响应式
 * 解构出来的值是reactive类型
 * */
const { warn, showWarn } = defineProps<{
  //子组件接收父组件传递过来的值
  warn?: string
  showWarn: boolean
}>()

/*切换护眼主题*/
const switchEyeTheme = () => {
  EyeLoading.value = true
  setTimeout(() => {
    EyeLoading.value = false
    olForm.theme['aside'].status = false
    olForm.theme['eye'].status = !olForm.theme['eye'].status
    theme.value = olForm.theme['eye'].status ? darkTheme : null
    themeDisabled.value = !!olForm.theme['eye'].status
    /*修改小型预览布局中的变量*/
    bgc.value = theme.value ? '#18181c' : '#FFF'
    asideBgc.value = bgc.value
    asideTextColor.value = theme.value ? '#cdd1da' : '#000'
    bgc_other.value = theme.value ? 'rgba(29,29,29,0.9)' : '#f4f4f4'
  }, 500)
}
/*切换侧边栏深色*/
const switchAsideTheme = () => {
  AsideLoading.value = true
  setTimeout(() => {
    AsideLoading.value = false
    olForm.theme['aside'].status = !olForm.theme['aside'].status
    /*修改小型预览布局中的变量*/
    theme.value = olForm.theme['aside'].status ? darkTheme : null
    asideBgc.value = theme.value ? '#001428' : '#FFF'
    asideTextColor.value = theme.value ? '#cdd1da' : '#000'
  }, 500)
}
/*获取localStorage已使用和剩余的容量*/
function getLocalStorageUsage() {
  // 获取已使用的LocalStorage大小（以字节为单位）
  let usedBytes = 0
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      usedBytes += localStorage[key].length * 2 // 每个字符占两个字节
    }
  }

  // 将字节转换为KB或MB
  let usedSize
  if (usedBytes < 1024) {
    usedSize = usedBytes + ' Bytes'
  } else if (usedBytes < 1024 * 1024) {
    usedSize = (usedBytes / 1024).toFixed(2) + ' KB'
  } else {
    usedSize = (usedBytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // 获取LocalStorage总容量（浏览器限制为约5-10MB）
  const totalBytes = 5 * 1024 * 1024 // 假设总容量为5MB

  // 计算剩余容量
  const remainingBytes = totalBytes - usedBytes

  // 将剩余容量转换为KB或MB
  let remainingSize
  if (remainingBytes < 1024) {
    remainingSize = remainingBytes + ' Bytes'
  } else if (remainingBytes < 1024 * 1024) {
    remainingSize = (remainingBytes / 1024).toFixed(2) + ' KB'
  } else {
    remainingSize = (remainingBytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return {
    used: usedSize,
    remaining: remainingSize
  }
}
/*关闭警告*/
const alertOff = () => {
  emit('alertOff')
}
// 示例用法
const localStorageUsage = getLocalStorageUsage()
console.log('已使用容量:', localStorageUsage.used)
console.log('剩余容量:', localStorageUsage.remaining)

/*监听表单是否有被修改*/
watchEffect(() => {
  form = shallowReactive(cloneDeep(olForm))
  emit('saveSettings', form)
  emit('alertOff')
})
onMounted(() => {
  themeDisabled.value = DISABLED.value
  olForm.theme['eye'].status = EYE_THEME.value
  olForm.theme['aside'].status = ASIDE_COLOR.value
  bgc.value = BGC.value
  asideBgc.value = ASIDE_BGC.value
  asideTextColor.value = ASIDE_TEXT_COLOR.value
  bgc_other.value = BGC_OTHER.value
  olForm.tags['search'].item = [...data.value.tags['search'].item]
  olForm.tags['search'].double = data.value.tags['search'].double
})

/*当选中了连按后需要把后面绑定的值都去掉*/
const handleChecked = (value: boolean) => {
  if (value && olForm.tags['search'].item.length > 0) {
    /*直接截掉两个元素*/
    olForm.tags['search'].item.splice(1, 2)
  }
}

/*当按下键盘的时候监听*/
const keyDownCreate = (label: any) => {
  if (Object.keys(olForm.tags['search'].item).length === 0) return
  // 输入框聚焦时，监听键盘事件
  document.addEventListener('keydown', handleKeyDown)
  return label
}

/*处理输入快捷键值*/
const handleKeyDown = (event: KeyboardEvent) => {
  const inputElement = document.activeElement as HTMLInputElement
  const { double, item } = olForm.tags['search']

  switch (true) {
    case double && item.length > 0:
      showErrorAndBlur('启动连按后只能绑定一个键')
      break
    case event.key === 'Process':
      showErrorAndBlur('请切换为英文输入')
      break
    case event.key === 'Tab':
      showError('不可以使用Tab键')
      break
    case event.key === ' ':
      showErrorAndBlur('不可以使用空格键')
      break
    case item.includes(event.key):
      showErrorAndBlur('该键已存在')
      break
    default:
      item.push(event.key)
      break
  }
  /*返回错误信息并且取消聚焦*/
  function showErrorAndBlur(message: string) {
    emit('showKeyDown', message)
    if (inputElement) {
      inputElement.blur()
    }
  }
  /*只返回错误信息*/
  function showError(message: string) {
    emit('showKeyDown', message)
  }
}
/*渲染快捷键绑定的tag*/
const renderTag = (tag: string, index: number) => {
  return h(
    NTag,
    {
      style: {
        borderRadius: '8px'
      },
      type: index < 1 ? 'success' : index < 2 ? 'info' : 'error',
      disabled: index > 3,
      closable: true,
      onClose: () => {
        olForm.tags['search'].item.splice(index, 1)
      }
    },
    {
      default: () => tag
    }
  )
}
</script>

<style lang="scss" scoped>
.container {
  font-size: 14px;
}
.example-box {
  height: 160px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: v-bind(bgc_other);
  .preview-aside {
    width: 50px;
    height: 140px;
    border-radius: 10px;
    background: v-bind(asideBgc);
    .aside-box {
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: v-bind(asideTextColor);
    }
  }

  .preview-header {
    width: 180px;
    height: 25px;
    border-radius: 8px;
    background: v-bind(bgc);
  }

  .preview-content {
    width: 180px;
    height: 110px;
    border-radius: 12px;
    background: v-bind(bgc);
  }
}

span {
  font-weight: bold;
}
</style>
