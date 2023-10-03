<template>
  <n-scrollbar>
    <template v-for="item in options" :key="item.path">
      <div
        class="box"
        :style="{
          background: item.path === active ? '#f2f2f2' : '#e5f3ec',
          color: item.path === active ? '#606060' : '#2ba764',
          fontWeight: item.path === active ? 600 : 400
        }"
        @click="handleTo"
        @mouseenter="handleMouse(item)">
        <n-space justify="space-between" align="center">
          <n-space align="center">
            <n-icon :size="18" :component="(vicons as any)[item.icon]" />
            <span>{{ item.name }}</span>
          </n-space>
          <n-icon :size="20" :component="vicons.ArrowBack" />
        </n-space>
      </div>
    </template>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import * as vicons from '@vicons/tabler'
import { Menu } from '@/services/types'

defineOptions({ name: 'SearchResult' })

const { value, options } = defineProps<{
  value: string
  options: Menu[]
}>()

interface Emits {
  (e: 'update:value', val: string): void
  (e: 'enter'): void
}

const emit = defineEmits<Emits>()

const active = computed({
  get() {
    return value
  },
  set(val: string) {
    emit('update:value', val)
  }
})

/** 鼠标移入 */
const handleMouse = async (item: any) => {
  active.value = item.path
}

const handleTo = () => {
  emit('enter')
}
</script>
<style scoped>
.box {
  height: fit-content;
  padding: 10px;
  margin-top: 10px;
  border-radius: 6px;
  cursor: pointer;
}
:deep(.n-icon) {
  display: flex;
  align-items: center;
}
</style>
