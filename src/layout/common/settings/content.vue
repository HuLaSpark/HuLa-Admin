<template>
  <n-space vertical>
    <div :class="animation" v-if="showWarn" class="alert">
      <span style="display: flex; align-items: center; gap: 20px">
        <img src="@/assets/svg/warning.svg" style="width: 100px; height: 100px" alt="" />
        <span style="color: #ee9f20; font-weight: bold">{{ warn }}</span>
      </span>
      <div style="padding: 5px 0; cursor: pointer" @click="alertOff">
        <n-icon :component="X" />
      </div>
    </div>
    <div class="box">
      <span>{{ t('eye_shield') }}</span>
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
      <n-config-provider :theme="theme">
        <n-card class="eyeshadow">
          <n-space hidden>
            <n-tag type="success">{{ t('example') }}</n-tag>
            <n-tag type="error" disabled>{{ t('example') }}</n-tag>
          </n-space>
        </n-card>
      </n-config-provider>
    </div>
  </n-space>
</template>

<script setup lang="ts">
import { Moon, Sun, X } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { darkTheme } from 'naive-ui'
import { cloneDeep } from 'lodash-es'
import { animation } from '@/components/modal/type'

const { t } = i18n.global
const store = mainStore()
const loading = ref(false)
const { THEME } = storeToRefs(store)
const olForm = reactive({
  themeStatus: false
})
// 定义跟踪变化的副本对象
let form = shallowReactive(cloneDeep(olForm))
const theme = ref()
const emit = defineEmits(['saveSettings', 'alertOff'])
// TODO 新版本3.3的defineProps解构例子 (nyh-2023-09-29 23:38:16)
/**
 * 使用旧版解构
 * const { warn, showWarn } = toRefs(props)
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
})
</script>

<style scoped>
.eyeshadow {
  height: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.box span {
  font-weight: bold;
}
.alert {
  width: 100%;
  height: fit-content;
  background: #fcf5eb;
  box-sizing: border-box;
  padding: 0 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
