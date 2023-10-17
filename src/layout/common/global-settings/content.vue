<template>
  <n-space vertical>
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
      <span>主题模式</span>
    </n-divider>
    <!--护眼模式-->
    <n-space justify="space-between" align="center">
      <p>{{ t('eye_shield') }}</p>
      <n-switch :rubber-band="false" :value="olForm.themeStatus" :loading="loading" @update:value="switchTheme">
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
    <n-config-provider :theme="theme">
      <n-card class="example-box">
        <n-space hidden>
          <n-tag type="success">{{ t('example') }}</n-tag>
          <n-tag type="error" disabled>{{ t('example') }}</n-tag>
        </n-space>
      </n-card>
    </n-config-provider>

    <n-divider title-placement="center">
      <span>快捷键绑定</span>
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
      :max="3" />
  </n-space>
</template>

<script setup lang="ts">
import { Moon, Sun } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { darkTheme, NTag } from 'naive-ui'
import { cloneDeep } from 'lodash-es'
import { AlertIze } from '@/customize'
import { globalSettings } from '@/stores/global-settings'

const { t } = i18n.global
const store = mainStore()
const loading = ref(false)
const { THEME } = storeToRefs(store)
const settingsStore = globalSettings()
const { data } = storeToRefs(settingsStore)
const olForm = reactive<{
  themeStatus: boolean
  tags: {
    [key: string]: {
      item: string[]
      double: boolean
    }
  }
}>({
  themeStatus: false,
  tags: { search: { item: [], double: false } }
})
/*定义跟踪变化的副本对象*/
let form = shallowReactive(cloneDeep(olForm))
/*示例数据变量*/
const theme = ref()
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

/*切换主题*/
const switchTheme = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    olForm.themeStatus = !olForm.themeStatus
    theme.value = olForm.themeStatus ? darkTheme : null
  }, 1000)
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
  olForm.themeStatus = THEME.value
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
const keyDownCreate = () => {
  if (Object.keys(olForm.tags['search'].item).length === 0) return
  // 输入框聚焦时，监听键盘事件
  window.addEventListener('keydown', handleKeyDown)
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

<style scoped>
.example-box {
  height: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

span {
  font-weight: bold;
}
</style>
