<template>
  <div class="aside">
    <div class="aside-head">
      <img id="unfold-img" v-if="collapsed" src="/logo.png" alt="" />
      <img id="collapsed-img" v-else src="/logo.png" alt="" />
      <p v-show="!collapsed" class="aside-title">HuLa</p>
    </div>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="200"
        :collapsed="collapsed"
        @collapse="collapsed = true"
        @expand="collapsed = false">
        <n-scrollbar style="max-height: 700px">
          <n-menu
            ref="menuInstRef"
            :root-indent="32"
            :indent="22"
            :style="collapsed ? '' : 'padding: 0 5px 0 0'"
            :accordion="true"
            v-model:value="activeKey"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions" />
        </n-scrollbar>
      </n-layout-sider>
    </n-layout>
    <div class="aside-footer" @click="handleCollapsed">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon v-if="collapsed" :size="28" :depth="3"><ArrowBigRightLines /></n-icon>
          <n-icon v-else :size="28" :depth="3"><ArrowBigLeftLines /></n-icon>
        </template>
        <span v-if="collapsed">{{ t('unfold') }}</span>
        <span v-else>{{ t('fold') }}</span>
      </n-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { NIcon } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores/main'
import { userStore } from '@/stores/user'
import { ArrowBigLeftLines, ArrowBigRightLines } from '@vicons/tabler'
import { i18n } from '@/i18n'
import * as vicons from '@vicons/tabler'
import { RouterLink, useRoute } from 'vue-router'
import { Menu } from '@/services/types'

const { t } = i18n.global
const route = useRoute()
const activeKey = ref<any>(route.path.split('/')[1])
const collapsed = ref(false)
const menuInstRef = ref()
const store = mainStore()
const menuStore = userStore()
const menus = menuStore.getMenus
const { BGC, TEXT_COLOR } = storeToRefs(store)

/*使用全局搜索的时候传入值后自动展开目录菜单项*/
watchEffect(() => {
  menuInstRef.value?.showOption(activeKey.value)
})

/*当url变化的时候侧边栏选项跟着变化*/
watch(
  () => route.path,
  (newPath) => {
    // 在路径变化时更新 activeKey
    activeKey.value = newPath.split('/')[1]
  }
)

const emit = defineEmits(['collapsed'])
const handleCollapsed = () => {
  collapsed.value = !collapsed.value
  emit('collapsed', collapsed.value)
}

const renderIcon = (icon: string) => {
  return () => h(NIcon, null, { default: () => h((vicons as any)[icon]) })
}

const menuOptions: MenuOption[] = menus.map((menu: Menu) => {
  const menuOption: MenuOption = {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: menu.page
          }
        },
        { default: () => menu.name }
      ),
    key: menu.path as any,
    icon: renderIcon(menu.icon)
  }
  if (menu.path) {
    return menuOption
  }
  menuOption.children = menu.children?.map((child) => ({
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: child.page
          }
        },
        { default: () => child.name }
      ),
    key: child.path as any,
    icon: renderIcon(child.icon)
  }))
  return menuOption
})
</script>
<style scoped>
.aside {
  position: relative;
  background: v-bind(BGC);
  margin: 10px 10px 15px 10px;
  border-radius: 10px;
}
.aside-head {
  display: flex;
  justify-content: center;
  padding: 10px 10px 0 10px;
}
.aside-footer {
  height: 50px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  bottom: 0;
  width: 100%;
  border-radius: 10px;
}
.aside-title {
  font-weight: bold;
  font-size: 18px;
  color: v-bind(TEXT_COLOR);
}
.aside-head #collapsed-img {
  width: 32px;
  height: 30px;
  margin: 1em;
  cursor: pointer;
  filter: drop-shadow(0 0 1em #2c964b);
}
.aside-head #unfold-img {
  width: 28px;
  height: 28px;
  margin: 1em 0;
  cursor: pointer;
}
/*!*图标的放大效果*!
@keyframes logo-spin {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

!*自动循环*!
@media (prefers-reduced-motion: no-preference) {
  .aside-head #collapsed-img {
    animation: logo-spin infinite 2s linear;
  }
  .aside-head #unfold-img {
    animation: logo-spin infinite 2s linear;
  }
}*/
:deep(.n-menu .n-menu-item-content) {
  font-weight: bold;
}
:deep(.n-menu .n-menu-item-content::before) {
  border-radius: 12px;
}
/*:deep(.n-menu .n-menu-item-content:not(.n-menu-item-content--disabled):hover::before) {*/
/*	background-color: #e5f3ec;*/
/*}*/
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content-header),
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content__arrow) {
  color: #2c964b;
}
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content__icon) {
  color: #2c964b;
}
:deep(.n-menu .n-menu-item-content .n-menu-item-content-header a):hover {
  color: #2c964b;
}
:deep(.n-layout-sider.n-layout-sider--bordered .n-layout-sider__border) {
  background-color: v-bind(BGC);
}
</style>
