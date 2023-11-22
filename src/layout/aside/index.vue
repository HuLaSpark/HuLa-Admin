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
              :options="menuOptions"
              @click="handleTab(activeKey)" />
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
import { NIcon, darkTheme } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores/main'
import { userStore } from '@/stores/user'
import { ArrowBigLeftLines, ArrowBigRightLines } from '@vicons/tabler'
import { i18n } from '@/i18n'
import * as vicons from '@vicons/tabler'
import { RouterLink, useRoute } from 'vue-router'
import { Menu } from '@/services/types'
import { tabs } from '@/stores/tabs'

const { t } = i18n.global
const route = useRoute()
const activeKey = ref<any>(route.path.split('/')[1])
const collapsed = ref(false)
const menuInstRef = ref()
const store = mainStore()
const menuStore = userStore()
const menus = menuStore.getMenus
const tabsStore = tabs()
const { BGC, ASIDE_TEXT_COLOR, ASIDE_BGC, ASIDE_COLOR } = storeToRefs(store)

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

/*处理tab选项*/
const handleTab = (key: string) => {
  menus.find((menu: any) => {
    if (menu.path === key) {
      tabsStore.addTab({
        data: { icon: menu.icon, path: menu.path, title: menu.name }
      })
    } else {
      menu.children?.find((child: any) => {
        if (child.path === key) {
          tabsStore.addTab({
            data: { icon: child.icon, path: child.path, title: child.name }
          })
        }
      })
    }
  })
}

const renderIcon = (icon: string) => {
  return () => <NIcon component={(vicons as any)[icon]} />
}

const menuOptions: MenuOption[] = menus.map((menu: Menu) => {
  const menuOption: MenuOption = {
    label: () => <RouterLink to={{ name: menu.page }}>{() => menu.name}</RouterLink>,
    key: menu.path as string,
    icon: renderIcon(menu.icon)
  }

  if (menu.path) {
    return menuOption
  }

  menuOption.children = menu.children?.map((child) => ({
    label: () => <RouterLink to={{ name: child.page }}>{() => child.name}</RouterLink>,
    key: child.path as string,
    icon: renderIcon(child.icon)
  }))

  return menuOption
})
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
  padding: 10px 10px 0 10px;
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
  filter: drop-shadow(0 0 1em #189f57);
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
  border-left: 4px solid #189f57;
}
:deep(.n-menu .n-menu-item-content::before) {
  border-radius: 4px;
}
:deep(.n-menu .n-menu-item-content:hover::before) {
  border-left: 4px solid #189f57;
}
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content-header),
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content__arrow) {
  color: #189f57;
}
:deep(.n-menu .n-menu-item-content:hover .n-menu-item-content__icon) {
  color: #189f57;
  transform: scale(1.2);
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
</style>
