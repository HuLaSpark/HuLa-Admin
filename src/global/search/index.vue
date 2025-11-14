<template>
  <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
    <template #trigger>
      <div @click="showSearch" class="search-input">
        <n-icon :size="24" :component="Search" />
        <span>{{ t('search') }}</span>
        <n-tag v-if="tips" style="border-radius: 6px" :bordered="false" size="small">
          {{ tips }}
        </n-tag>
      </div>
    </template>
    {{ t('global_search') }}
  </n-tooltip>
  <!--全局弹框-->
  <search-modal v-model:value="show" />
</template>

<script lang="ts" setup>
import { SearchModal } from './components'
import { Search } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { globalSettings } from '@/stores/global-settings'
import { storeToRefs } from 'pinia'
import hotkeys from 'hotkeys-js'
import Mitt from '@/utils/Bus'
import { delay } from 'lodash-es'
import { globalSetting } from '@/services/types'

defineOptions({ name: 'GlobalSearch' })
// TODO defineAsyncComponent异步组件会导致动画失效 (nyh-2023-12-20 23:15:17)
const { t } = i18n.global
const show = ref(false)
const shiftCount = ref(0)
const shiftTimeout = ref<NodeJS.Timeout | null>(null)
const settingsStore = globalSettings()
const { data } = storeToRefs(settingsStore)
const Form = reactive<globalSetting>({
  theme: {
    eye: { status: false },
    aside: { status: false }
  },
  tags: { search: { item: ['Shift'], double: true } }
})
/*如果没有创建配置文件缓存需要先创建*/
if (Object.keys(data.value).length === 0) {
  settingsStore.setSettings({ ...Form })
}
/*获取缓存中的tags对象中的search*/
const key = ref(data.value.tags['search'])
/* 计算出快捷键的值有哪些 */
const tips = computed(() =>
  data.value.tags['search'].item.map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1)).join('+')
)
/*监听兄弟组件配置是否更新*/
Mitt.on('search', (event: any) => {
  key.value = event
})
/*重置计数器和延时器*/
const resetTimer = () => {
  shiftCount.value = 0
  if (shiftTimeout.value !== null) {
    clearTimeout(shiftTimeout.value)
    shiftTimeout.value = null
  }
}
/*打开弹框*/
const showSearch = () => {
  show.value = true
  resetTimer()
}
// 监听键盘事件
document.addEventListener('keydown', (event) => {
  // TODO 没有绑定特点修饰键的时候不会触发 (nyh-2023-11-10 22:09:41)
  if (key.value.item.length === 1 && !data.value.tags['search'].double && key.value.item.includes(event.key)) {
    delay(() => {
      showSearch()
    }, 300)
  }
  if (key.value.item.length === 1 && data.value.tags['search'].double && key.value.item.includes(event.key)) {
    shiftCount.value++
    if (shiftCount.value === 1) {
      // 如果按下了第一次 Shift 键，则设置延时器
      shiftTimeout.value = setTimeout(() => {
        shiftCount.value = 0
        shiftTimeout.value = null
      }, 1000) // 1秒内没有第二次 Shift 键按下，重置计数器
    } else if (shiftCount.value === 2) {
      // 如果按下了第二次按键，则触发 showSearch
      delay(() => {
        showSearch()
        resetTimer()
      }, 300)
    }
  }
  if (key.value.item.length > 1 && !data.value.tags['search'].double && key.value.item.includes(event.key)) {
    const combinedKeys = key.value.item.join('+')
    hotkeys(combinedKeys, () => {
      delay(() => {
        showSearch()
      }, 300)
    })
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/scss/layout-header.scss';
.search-input {
  display: flex;
  align-items: center;
  height: 25px;
  gap: 10px;
  span {
    width: 25px;
    font-size: 12px;
  }
}
</style>
