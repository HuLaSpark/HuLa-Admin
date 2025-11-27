import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { userStore } from '@/stores/user'
import type { MenuItem } from '@/interface/IRouter'
import { noPermissionPaths, paginationPage } from './options.ts'
import { tabs } from '@/stores/tabs'

// 动态导入 views/page 目录下的所有页面组件
const modules = import.meta.glob('../views/page/*.vue') as Record<string, () => Promise<any>>
// 可用页面名称集合，例如 Home、User、Role 等
const availablePages = new Set(
  Object.keys(modules)
    .map((key) => {
      const match = key.match(/\/([^/]+)\.vue$/)
      return match ? match[1] : ''
    })
    .filter(Boolean)
)

const { VITE_APP_TITLE, VITE_TITLE_SUFFIX, BASE_URL } = import.meta.env
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/views/error/index.vue')
  },
  {
    path: '/',
    name: 'page',
    component: () => import('@/layout/index.vue'),
    // 斜杠重定向路由到 /home
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        meta: {
          title: '主页',
          requiresAuth: true
        },
        component: () => import('@/views/page/Home.vue')
      },
      {
        path: '/im/user',
        name: 'ImUser',
        meta: {
          title: '用户 / 黑名单管理',
          requiresAuth: true
        },
        component: () => import('@/views/page/ImUser.vue')
      },
      {
        path: '/im/black',
        name: 'ImBlack',
        meta: {
          title: '黑名单列表',
          requiresAuth: true
        },
        component: () => import('@/views/page/ImBlack.vue')
      },
      {
        path: '/im/group',
        name: 'ImGroup',
        meta: {
          title: '群聊管理',
          requiresAuth: true
        },
        component: () => import('@/views/page/ImGroup.vue')
      },
      {
        path: '/im/moment',
        name: 'ImMoment',
        meta: {
          title: '朋友圈管理',
          requiresAuth: true
        },
        component: () => import('@/views/page/ImMoment.vue')
      },
      {
        path: '/ai/model',
        name: 'AiModel',
        meta: {
          title: 'AI 能力中心',
          requiresAuth: true
        },
        component: () => import('@/views/page/AiModel.vue')
      },
      {
        path: '/stats/login-rank',
        name: 'LoginRank',
        meta: {
          title: '登录排行',
          requiresAuth: true
        },
        component: () => import('@/views/page/LoginRank.vue')
      },
      {
        path: '/im/config',
        name: 'ImConfig',
        meta: {
          title: 'IM 配置',
          requiresAuth: true
        },
        component: () => import('@/views/page/ImConfig.vue')
      },
      {
        path: '/im/contact',
        name: 'ImContact',
        meta: {
          title: '联系人 / 好友管理',
          requiresAuth: true
        },
        component: () => import('@/views/page/ImContact.vue')
      }
      ,
      {
        path: '/im/active',
        name: 'ActiveUsers',
        meta: {
          title: '活跃用户',
          requiresAuth: true
        },
        component: () => import('@/views/page/ActiveUsers.vue')
      }
    ]
  }
]

// 创建路由
const router: any = createRouter({
  history: createWebHashHistory(BASE_URL),
  routes
})

// 注意：刷新页面会导致页面路由重置
export const setRoutes = (menus?: MenuItem[]) => {
  if (!menus || !menus.length) {
    const manager = localStorage.getItem('localUserInfo')
    if (!manager) {
      return
    }
    menus = JSON.parse(manager).loginInfo.menus
  }
  if (menus?.length) {
    /**
     * 根据菜单数据动态添加路由
     * @param routeItem
     */
    const addDynamicRoute = (routeItem: MenuItem) => {
      if (routeItem.page && routeItem.path) {
        // 仅为当前项目中真实存在的页面添加路由，避免导入不存在的 .vue 文件
        if (!availablePages.has(routeItem.page)) {
          console.warn(`[router] 页面组件不存在，已忽略路由：${routeItem.page}`)
          return
        }

        const key = `../views/page/${routeItem.page}.vue`
        const component = modules[key]
        if (!component) return

        // 使用后端路由 id 或路径作为路由 name，避免多个菜单共用同一个 page 导致 name 冲突
        const routeName = routeItem.id || routeItem.path || routeItem.page

        router.addRoute('page', {
          path: routeItem.path,
          name: routeName,
          meta: {
            title: routeItem.name,
            icon: routeItem.icon,
            requiresAuth: true,
            dynamicAdded: true,
            hideMenu: routeItem.hideMenu,
            hideChildrenInMenu: routeItem.hideChildrenInMenu
          },
          component
        })
      }
    }
    menus.forEach((item) => {
      addDynamicRoute(item)
      if (item.children && item.children.length) {
        item.children.forEach((sub) => {
          addDynamicRoute(sub)
        })
      }
    })
  }
}
setRoutes()

//重置路由的方法
export const resetRouter = () => {
  // 获得当前路由器所有的路由记录
  const currentRoutes = router.getRoutes()
  // 过滤出动态添加的路由记录
  currentRoutes.forEach((route: any) => {
    if (route.meta && route.meta.dynamicAdded) {
      router.removeRoute(route.name)
    }
  })
}

// 路由前置守卫
router.beforeEach(async (to: any, _from: any, next: any) => {
  /*设置页面标题和标题后缀*/
  document.title = to.meta.title ? to.meta.title + VITE_TITLE_SUFFIX : VITE_APP_TITLE
  const tabsStore = tabs()
  if (to.meta.requiresAuth && to.path !== '/home') {
    tabsStore.addTab({
      data: { icon: to.meta.icon, path: to.path, title: to.meta.title }
    })
  }
  const store = userStore() // 拿到用户对象id信息判断是否登录
  const {
    loginInfo: { token }
  } = store
  /*判断页面是否需要分页*/
  paginationPage.includes(to.name) ? (to.meta.pagination = true) : (to.meta.pagination = false)

  // 如果已登录但还没有加载动态路由，则加载动态路由
  if (token && (!store.loginInfo.menus || store.loginInfo.menus.length === 0)) {
    try {
      await store.initUserInfo()
      // 动态路由加载完成后，重新导航到目标路由
      return next({ ...to, replace: true })
    } catch (error) {
      console.error('加载用户信息失败:', error)
      // 加载失败，清除登录状态并跳转到登录页
      store.$reset()
      return next('/login')
    }
  }

  // 如果未登录并且要访问的路径需要登录权限
  if (!token && !noPermissionPaths.includes(to.path)) {
    return next('/login') // 重定向到登录页
  }

  // 如果要访问的路径不存在(没有匹配的路由记录)
  if (!to.matched.length) {
    return next('/:catchAll(.*)') // 重定向到捕获所有路径的路由
  }

  // 其他情况，继续路由导航
  next()
})

export default router
