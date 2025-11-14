<template>
  <n-scrollbar style="max-height: 360px">
    <transition-group tag="div" appear :enter-active-class="'animate__animated animate__fadeIn'">
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
                <n-icon :size="18" :component="item.icon ? (vicons as any)[item.icon as string] : undefined" />
                <n-space :size="10">
                  <span>{{ item.name }}</span>
                  <span style="font-size: 12px" :style="item.path === active.path ? 'text-decoration: underline' : ''">
                    {{ '/' + item.path }}
                  </span>
                </n-space>
              </n-space>
              <n-icon :size="20" :component="vicons.ArrowBack" />
            </n-space>
          </div>
        </div>
      </template>
    </transition-group>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import * as vicons from '@vicons/tabler'
import { Menu } from '@/services/types'

defineOptions({ name: 'SearchResult' })

const { path, name, options } = defineProps<{
  path: string
  name: string
  options: Menu[]
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
@use '@/styles/scss/global-search';
</style>
