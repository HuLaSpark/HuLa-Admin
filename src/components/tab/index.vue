<template>
  <div style="display: flex; align-items: center; gap: 10px">
    <div
      class="tab"
      :class="{
        'active-tab': '/' + item.path === router.currentRoute.path,
        'inactive-tab': '/' + item.path !== router.currentRoute.path
      }"
      v-for="item in data"
      :key="item.path"
      @click.stop="router.push('/' + item.path)">
      {{ item.title }}
      <n-icon
        v-if="Object.keys(data).length > 1"
        class="del"
        size="14"
        :component="X"
        @click.stop="jumpPath(item.path)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from '@vicons/tabler'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { tabs } from '@/stores/tabs'
import router from '@/router/index'

const store = mainStore()
const tabsStore = tabs()
const { BGC } = storeToRefs(store)
const { data } = storeToRefs(tabsStore)

const jumpPath = (path: string) => {
  let openPages = Object.keys(data.value) // 假设 data.value 是你的 openPages
  let index = openPages.findIndex((r) => r === path)
  if (index === 0) {
    router.push('/' + openPages[index + 1])
    tabsStore.removeTab(path)
  } else {
    router.push('/' + openPages[index - 1])
    tabsStore.removeTab(path)
  }
}
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px 6px 6px 4px;
  padding: 5px 6px 5px 10px;
  background: v-bind(BGC);
  border-left: 4px solid #189f57;
  gap: 10px;
  .active-tab {
    color: #2ba764;
  }
  .inactive-tab {
    color: #666666;
  }
  &:hover {
    cursor: pointer;
    color: #189f57;
  }
  .del {
    color: rgba(60, 60, 60);
    border-radius: 50px;
    transition: 0.5s;
  }
  .del:hover {
    background: rgba(60, 60, 60, 0.2);
  }
}
</style>
