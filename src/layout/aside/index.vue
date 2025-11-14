<template>
  <div :class="ASIDE_COLOR ? 'aside' : 'aside-eye'">
    <div class="aside-head">
      <img id="unfold-img" v-if="collapsed" src="/logo.png" alt="" />
      <img id="collapsed-img" v-else src="/logo.png" alt="" />
      <p v-show="!collapsed" class="aside-title">HuLa</p>
    </div>
    <n-config-provider :theme="ASIDE_COLOR ? darkTheme : undefined">
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
              :class="ASIDE_COLOR ? 'aside-menu' : ''"
              ref="menuInstRef"
              :root-indent="32"
              :indent="22"
              :style="collapsed ? '' : 'padding: 0 5px 0 5px'"
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
    </n-config-provider>
  </div>
</template>

<script setup lang="tsx">
import type { MenuOption } from 'naive-ui'
import { darkTheme, NIcon } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores/main'
import { userStore } from '@/stores/user'
import * as vicons from '@vicons/tabler'
import { ArrowBigLeftLines, ArrowBigRightLines } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { RouterLink, useRoute } from 'vue-router'
import { Menu } from '@/services/types'

// 动态收集当前项目中实际存在的页面组件，用于过滤菜单和添加路由
const pageModules = import.meta.glob('../../views/page/*.vue') as Record<string, () => Promise<any>>
const availablePages = new Set(
  Object.keys(pageModules)
    .map((key) => {
      const match = key.match(/\/([^/]+)\.vue$/)
      return match ? match[1] : ''
    })
    .filter(Boolean)
)


const { t } = i18n.global
const route = useRoute()
// 使用完整路由路径作为菜单选中 key，避免层级不一致导致的高亮问题
const activeKey = ref<any>(route.path)
const collapsed = ref(false)
const menuInstRef = ref()
const store = mainStore()
const menuStore = userStore()
const menus = menuStore.getMenus
const { BGC, ASIDE_TEXT_COLOR, ASIDE_BGC, ASIDE_COLOR } = storeToRefs(store)

/*使用全局搜索的时候传入值后自动展开目录菜单项*/
// watchEffect(() => {
//   menuInstRef.value?.showOption(activeKey.value)
// })

/*当url变化的时候侧边栏选项跟着变化*/
watch(
  () => route.path,
  (newPath) => {
    // 在路径变化时更新 activeKey
    activeKey.value = newPath
    menuInstRef.value?.showOption(activeKey.value)
  }
)

const emit = defineEmits(['collapsed'])
const handleCollapsed = () => {
  collapsed.value = !collapsed.value
  emit('collapsed', collapsed.value)
}

const DEFAULT_MENU_ICON = 'LayoutGrid'

/* 渲染菜单图标（兼容后端返回的任意 icon 字符串，找不到则使用默认图标） */
const renderIcon = (icon?: string) => {
  const iconName = icon && (vicons as any)[icon] ? icon : DEFAULT_MENU_ICON
  const Comp = (vicons as any)[iconName]
  if (!Comp) return undefined
  return () => <NIcon component={Comp} />
}

/* 菜单数据 排除了主页的路由，实现 hideMenu / hideChildrenInMenu，且仅展示当前项目中真实存在页面的菜单 */
const menuOptions: MenuOption[] = menus
  .filter((menu: Menu) => menu.path !== 'home')
  .filter((menu: Menu) => !menu.hideMenu)
  .map((menu: Menu) => {
    const hasChildren = Array.isArray(menu.children) && menu.children.length > 0 && !menu.hideChildrenInMenu

    // 没有子菜单的普通菜单项；如果对应的页面不存在，则不展示
    if (!hasChildren && menu.page && menu.path) {
      if (!availablePages.has(menu.page)) return null as any

      return {
        // 使用 path 进行跳转，避免依赖路由 name，适配动态路由 name 使用 id/path 的情况
        label: () => <RouterLink to={{ path: menu.path as string }}>{() => menu.name}</RouterLink>,
        key: menu.path as string,
        icon: renderIcon(menu.icon)
      } as MenuOption
    }

    // 作为分组存在的菜单（多级菜单）
    const childrenOptions: MenuOption[] = (menu.children || [])
      .filter((child) => !child.hideMenu && (!child.page || availablePages.has(child.page)))
      .map((child) => ({
        // 同样通过 path 导航，保证和动态路由 path 对齐
        label: () => <RouterLink to={{ path: child.path as string }}>{() => child.name}</RouterLink>,
        key: child.path as string,
        icon: renderIcon(child.icon)
      }))

    // 如果分组下没有可展示的子菜单，则不展示该分组
    if (!childrenOptions.length) return null as any

    return {
      label: () => <span>{menu.name}</span>,
      key: (menu.path || menu.id || menu.name) as string,
      icon: renderIcon(menu.icon),
      children: childrenOptions
    } as MenuOption
  })
  .filter(Boolean) as MenuOption[]
</script>
<style scoped>
.aside {
  position: relative;
  background: v-bind(ASIDE_BGC);
  margin: 10px 10px 15px 10px;
  border-radius: 10px;
}
/*!护眼主题*/
.aside-eye {
  position: relative;
  background: v-bind(BGC);
  margin: 10px 10px 15px 10px;
  border-radius: 10px;
}
.aside-head {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px 5px 10px;
}
.aside-menu {
  background: v-bind(ASIDE_BGC);
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
  color: v-bind(ASIDE_TEXT_COLOR);
}
.aside-head #collapsed-img {
  width: 32px;
  height: 30px;
  margin: 1em;
  cursor: pointer;
  filter: drop-shadow(0 0 0.8em #189f57);
}
.aside-head #unfold-img {
  width: 28px;
  height: 28px;
  margin: 1em 0;
  cursor: pointer;
}
/*修改menu选择的样式*/
:deep(.n-menu .n-menu-item-content) {
  font-weight: bold;
}
:deep(.n-menu .n-menu-item-content.n-menu-item-content--selected::before) {
  border-left: 6px solid #189f57;
}
:deep(.n-menu .n-menu-item-content::before) {
  border-radius: 6px;
}
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content-header),
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content__arrow) {
  color: #189f57;
}
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content__icon) {
  color: #189f57;
  animation: twinkle 0.3s ease-in-out;
}
:deep(.n-menu .n-menu-item-content .n-menu-item-content-header a):hover {
  color: #189f57;
}
:deep(.n-layout-sider.n-layout-sider--bordered .n-layout-sider__border) {
  background-color: v-bind(BGC);
}
/*去除菜单menu中的边框*/
:deep(.n-layout-sider .n-layout-sider__border) {
  width: 0;
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
