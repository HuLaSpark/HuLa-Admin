<template>
  <n-scrollbar style="max-height: 360px">
    <template v-for="item in options" :key="item.path">
      <div style="padding: 0 5px 0 5px">
        <div
          class="box"
          :style="{
            background: item.path === active.path ? '#41b782' : '#e5f3ec',
            color: item.path === active.path ? '#f2f2f2' : '#2ba764',
            fontWeight: item.path === active.path ? 600 : 400
          }"
          @click="handleTo"
          @mouseenter="handleMouse(item)">
          <n-space justify="space-between" align="center">
            <n-space align="center">
              <n-icon :size="20" :component="Clock" />
              <n-space :size="10">
                <span>{{ item.name }}</span>
                <span style="font-size: 12px" :style="item.path === active.path ? 'text-decoration: underline' : ''">
                  {{ '/' + item.path }}
                </span>
              </n-space>
            </n-space>
            <n-icon :size="20" :component="X" />
          </n-space>
        </div>
      </div>
    </template>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { Clock, X } from '@vicons/tabler'

defineOptions({ name: 'SearchRecord' })

const { path, name, options } = defineProps<{
  path: string
  name: string
  options: { path: string; name: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:path', name: string): void
  (e: 'update:name', path: string): void
  (e: 'enter'): void
}>()

const active = computed({
  get() {
    return {
      name: name,
      path: path
    }
  },
  set(val: { name: string; path: string }) {
    emit('update:path', val.path)
    emit('update:name', val.name)
  }
})

/** 鼠标移入 */
const handleMouse = async (item: any) => {
  active.value = {
    name: item.name,
    path: item.path
  }
}

const handleTo = () => {
  emit('enter')
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/global-search';
</style>
