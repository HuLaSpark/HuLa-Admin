<template>
  <!--TODO 如果标签栏过多操过宽度后需要滚动条滚动到选中的标签页下  (nyh-2023-11-23 07:22:29)-->
  <n-scrollbar x-scrollable>
    <div style="display: flex; align-items: center; gap: 10px; white-space: nowrap">
      <div
        class="tab"
        :class="{ 'active-tab': '/' + item.path === currentPath }"
        v-for="item in data"
        :key="item.path"
        @click.stop="router.push('/' + item.path)">
        <n-icon class="tab-icon" size="16" :component="(vicons as any)[item.icon]" />
        {{ item.title }}
        <n-icon
          v-if="Object.keys(data).length > 1"
          class="del"
          size="14"
          :component="X"
          @click.stop="jumpPath(item.path)" />
      </div>
    </div>
  </n-scrollbar>
</template>

<script setup lang="ts">
import { X } from '@vicons/tabler'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { tabs } from '@/stores/tabs'
import router from '@/router/index'
import * as vicons from '@vicons/tabler'

const store = mainStore()
const tabsStore = tabs()
const { BGC, TEXT_COLOR, TAB_ACTIVE_BGC, HOVER_BGC } = storeToRefs(store)
const { data } = storeToRefs(tabsStore)
const currentPath = computed(() => router.currentRoute.value.path)

const jumpPath = (path: string) => {
  let openPages = Object.keys(data.value)
  let index = openPages.findIndex((r) => r === path)
  /*判断当前删除的路由是否是当前的路由*/
  if ('/' + path === currentPath.value) {
    /*是否是第一个或者最后一个，否则就是在中间选中的默认是往回跳转*/
    if (index === 0) {
      router.push('/' + openPages[index + 1])
    } else if (index === openPages.length - 1) {
      router.push('/' + openPages[index - 1])
    } else {
      router.push('/' + openPages[index - 1])
    }
  }
  tabsStore.removeTab(path)
}

onMounted(() => {
  /*初始化的时候判断data是否为空*/
  if (Object.keys(data.value).length === 0) {
    // TODO 这了为空的时候应该查询localStorage中缓存的菜单项目并且是全部权限都可查看的菜单 (nyh-2023-11-25 08:09:06)
    tabsStore.addTab({
      data: { icon: 'DeviceAnalytics', path: 'odometer', title: '仪表板' } as any
    })
  }
})
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px 6px 6px 4px;
  padding: 5px 6px 5px 10px;
  background: v-bind(BGC);
  color: v-bind(TEXT_COLOR);
  border-bottom: 2px solid #189f57;
  gap: 10px;
  &:hover {
    cursor: pointer;
    color: #189f57;
    .tab-icon {
      animation: twinkle 0.3s ease-in-out;
    }
  }
  .del {
    color: v-bind(TEXT_COLOR);
    border-radius: 50px;
    transition: 0.5s;
    &:hover {
      background: v-bind(HOVER_BGC);
    }
  }
}
/*当前选中页面样式*/
.active-tab {
  color: #189f57;
  background: v-bind(TAB_ACTIVE_BGC);
}
/*end*/
@keyframes twinkle {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
