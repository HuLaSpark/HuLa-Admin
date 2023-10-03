<template>
  <div class="operation-list-box">
    <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
      <template #trigger>
        <n-icon :size="24" @click="showSearch"><Search /></n-icon>
      </template>
      {{ t('global_search') }}
    </n-tooltip>
  </div>
  <!--全局弹框-->
  <search-modal v-model:value="show" />
</template>

<script lang="ts" setup>
import { SearchModal } from './components'
import { Search } from '@vicons/tabler'
import { i18n } from '@/i18n'

defineOptions({ name: 'GlobalSearch' })

const { t } = i18n.global
const show = ref(false)
const shiftCount = ref(0)
let shiftTimeout: NodeJS.Timeout | null = null

const showSearch = () => {
  show.value = true
  // 重置计数器和延时器
  shiftCount.value = 0
  if (shiftTimeout !== null) {
    clearTimeout(shiftTimeout)
    shiftTimeout = null
  }
}

// 监听键盘事件
window.addEventListener('keydown', (event) => {
  if (event.key === 'Shift') {
    shiftCount.value++
    if (shiftCount.value === 1) {
      // 如果按下了第一次 Shift 键，则设置延时器
      shiftTimeout = setTimeout(() => {
        shiftCount.value = 0
        shiftTimeout = null
      }, 1000) // 1秒内没有第二次 Shift 键按下，重置计数器
    } else if (shiftCount.value === 2) {
      // 如果按下了第二次 Shift 键，则触发 showSearch
      showSearch()
      shiftCount.value = 0
      if (shiftTimeout !== null) {
        clearTimeout(shiftTimeout)
        shiftTimeout = null
      }
    }
  } else {
    shiftCount.value = 0
    if (shiftTimeout !== null) {
      clearTimeout(shiftTimeout)
      shiftTimeout = null
    }
  }
})
</script>

<style scoped>
@import '@/assets/css/layout-header.css';
</style>
