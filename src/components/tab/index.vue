<template>
  <!--TODO 如果标签栏过多操过宽度后需要滚动条滚动到选中的标签页下  (nyh-2023-11-23 07:22:29)-->
  <!--TODO 使用TransitionGroup动画 (nyh-2023-12-02 08:02:32)-->
  <!--TODO 建议根据用户id或者租户id进行存储（现在在登录的时候判断是否已经切换账号，切换就清空） (nyh-2023-12-12 11:51:24)-->
  <!--主页-->
  <div class="home-box" :class="{ 'home-bg': currentPath === '/home' }">
    <n-icon @click="router.push('/home')" size="24" :component="SmartHome" />
  </div>
  <n-scrollbar x-scrollable>
    <div style="display: flex; align-items: center; padding: 0 2px 4px 2px; gap: 10px; white-space: nowrap">
      <div
        class="tab"
        :class="{ 'active-tab': item.path === currentPath }"
        v-for="item in data"
        :key="item.path"
        @contextmenu="handleContextMenu($event, item.path)"
        @click.stop="router.push(item.path)">
        <div class="tabs-left" />
        <n-icon
          class="tab-icon"
          size="18"
          :component="(vicons as any)[item.icon] || (vicons as any)[DEFAULT_TAB_ICON]"
        />
        {{ item.title }}
        <n-icon class="del" size="14" :component="X" @click.stop="removeTabs(item.path)" />
      </div>

      <n-dropdown
        style="border-radius: 6px"
        placement="bottom-start"
        trigger="manual"
        :x="xRef"
        :y="yRef"
        :options="options"
        :show="showDropdownRef"
        :on-clickoutside="() => (showDropdownRef = false)"
        @select="handleTabsMenu" />
    </div>
  </n-scrollbar>
  <!--tabs操作栏-->
  <div style="display: flex; align-items: center; padding: 4px 8px">
    <n-dropdown style="border-radius: 6px" trigger="click" :options="options" @select="handleSelect">
      <n-button
        @click.stop="tabsMenuDis = Object.keys(data).length <= 1"
        style="border-radius: 6px; height: 34px"
        size="tiny"
        tertiary>
        <template #icon>
          <n-icon size="22" :component="DotsVertical" />
        </template>
      </n-button>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import * as vicons from '@vicons/tabler'
import { BrowserX, DotsVertical, LetterA, LetterO, SmartHome, X } from '@vicons/tabler'

const DEFAULT_TAB_ICON = 'LayoutGrid'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { tabs } from '@/stores/tabs'
import router from '@/router/index'
import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import { i18n } from '@/i18n'

const { t } = i18n.global
const store = mainStore()
const tabsStore = tabs()
const { BGC, TEXT_COLOR, TAB_ACTIVE_BGC, HOVER_BGC } = storeToRefs(store)
const { data } = storeToRefs(tabsStore)
const currentPath = computed(() => router.currentRoute.value.path)
/*标签页操作栏*/
const showDropdownRef = ref(false)
const tabsOptions = ref()
const tabsMenuDis = ref(false)
const xRef = ref(0)
const yRef = ref(0)
const options = computed(() => {
  return [
    {
      label: t('close_tab'),
      key: 'closeCurrent',
      icon: renderIcon(BrowserX)
    },
    {
      label: t('close_other_tabs'),
      key: 'closeOther',
      icon: renderIcon(LetterO),
      disabled: tabsMenuDis.value
    },
    {
      label: t('close_all_tabs'),
      key: 'closeAll',
      icon: renderIcon(LetterA)
    }
  ]
})

/*渲染图标*/
const renderIcon = (icon: Component) => {
  return () => {
    return h(
      NIcon,
      { size: 20 },
      {
        default: () => h(icon)
      }
    )
  }
}

/*处理tabs右键菜单*/
const handleTabsMenu = (key: string) => {
  showDropdownRef.value = false
  let replaceCurrent = tabsOptions.value
  let openPages = Object.keys(data.value)
  switch (key) {
    case 'closeCurrent':
      removeTabs(replaceCurrent)
      break
    case 'closeOther':
      openPages.forEach((r) => {
        if (r !== replaceCurrent) {
          removeTabs(r)
        }
      })
      /*因为有可能右键选中的不是当前路由的标签页，所以需要手动跳转到右键选中的标签页*/
      router.push(replaceCurrent)
      break
    case 'closeAll':
      openPages.forEach((r) => {
        removeTabs(r)
      })
  }
}

/*处理统一标签页操作栏*/
const handleSelect = (key: string) => {
  showDropdownRef.value = false
  let replaceCurrent = currentPath.value
  let openPages = Object.keys(data.value)
  switch (key) {
    case 'closeCurrent':
      if (replaceCurrent === 'home') {
        window.$message.warning('主页不能关闭')
        break
      }
      removeTabs(replaceCurrent)
      break
    case 'closeOther':
      openPages.forEach((r) => {
        if (r !== replaceCurrent) {
          removeTabs(r)
        }
      })
      break
    case 'closeAll':
      openPages.forEach((r) => {
        removeTabs(r)
      })
  }
}

/*处理标签页右键菜单*/
const handleContextMenu = (e: MouseEvent, path?: string) => {
  e.preventDefault()
  showDropdownRef.value = false
  tabsMenuDis.value = Object.keys(data.value).length <= 1
  if (path) {
    tabsOptions.value = path
  }
  nextTick().then(() => {
    showDropdownRef.value = true
    xRef.value = e.clientX
    yRef.value = e.clientY
  })
}

/*删除标签页*/
const removeTabs = (path: string) => {
  let openPages = Object.keys(data.value)
  let index = openPages.findIndex((r) => r === path)
  /*判断当前删除的路由是否是当前的路由*/
  if (path === currentPath.value && openPages.length > 1) {
    /*是否是第一个或者最后一个，否则就是在中间选中的默认是往回跳转*/
    const targetIndex = index === 0 ? index + 1 : index - 1
    router.push(openPages[targetIndex])
  }
  tabsStore.removeTab(path)
}

// onMounted(() => {
//   /*初始化的时候判断data是否为空*/
//   if (Object.keys(data.value).length === 0) {
//     // TODO 这了为空的时候应该查询localStorage中缓存的菜单项目并且是全部权限都可查看的菜单 (nyh-2023-11-25 08:09:06)
//     // TODO 如果没有标签页的时候暂时先固定展示仪表板，因为路由重定向有问题没有解决 (nyh-2023-12-07 02:47:54)
//     // tabsStore.addTab({
//     //   data: { icon: 'DeviceAnalytics', path: 'odometer', title: '仪表板' } as any
//     // })
//   }
// })
</script>

<style lang="scss" scoped>
.home-box {
  display: flex;
  align-items: center;
  flex: 1;
  border-radius: 6px;
  color: v-bind(TEXT_COLOR);
  padding: 6px;
  margin-right: 10px;
  border: 1px solid rgba(255, 255, 255, 0);
  box-shadow: 2px 2px 4px rgba(255, 255, 255, 0);
  gap: 10px;
  &:hover {
    cursor: pointer;
    color: #189f57;
    .n-icon {
      animation: twinkle 0.3s ease-in-out;
    }
  }
}
.tab {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 8px 16px 8px 18px;
  background: v-bind(BGC);
  font-size: 14px;
  color: v-bind(TEXT_COLOR);
  border: 1px solid rgba(60, 60, 60, 0.1);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  transition: padding 0.3s ease-in-out;
  gap: 5px;
  &:hover {
    padding-right: 22px;
    padding-left: 12px;
    cursor: pointer;
    color: #189f57;
    .tab-icon {
      animation: twinkle 0.3s ease-in-out;
    }
    .del {
      opacity: 1;
    }
  }
  .tabs-left {
    position: absolute;
    left: -2px;
    border-radius: 8px;
    background: #189f57;
    height: 25px;
    width: 4px;
  }
  .del {
    position: absolute;
    right: 5px;
    opacity: 0;
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
  padding-right: 22px;
  padding-left: 12px;
  color: #189f57;
  background: v-bind(TAB_ACTIVE_BGC);
  .del {
    opacity: 1;
  }
}
/*主页选中的样式*/
.home-bg {
  color: #189f57;
  background: v-bind(TAB_ACTIVE_BGC);
  border: 1px solid rgba(60, 60, 60, 0.1);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
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
