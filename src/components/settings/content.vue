<template>
  <n-space vertical>
    <n-alert title="提醒" type="warning" v-if="showWarn"> {{ warn }}</n-alert>
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
import { Moon, Sun } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { darkTheme } from 'naive-ui'
import { cloneDeep } from 'lodash-es'

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
const emit = defineEmits(['saveSettings'])
const props = defineProps<{
  //子组件接收父组件传递过来的值
  warn?: string
  showWarn: boolean
}>()
//使用父组件传递过来的值
const { warn, showWarn } = toRefs(props)

/*切换主题*/
const switchTheme = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    olForm.themeStatus = !olForm.themeStatus
    theme.value = olForm.themeStatus ? darkTheme : null
  }, 1000)
}
watchEffect(() => {
  form = shallowReactive(cloneDeep(olForm))
  emit('saveSettings', form)
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
</style>
