import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { userStore } from '@/stores/user'
import type { MenuItem } from '@/interface/IRouter'
import { paginationPage } from './paginationArray'
import { tabs } from '@/stores/tabs'

// const modules = import.meta.glob('../views/system/*.vue')
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
    name: 'system',
    component: () => import('@/layout/index.vue'),
    //斜杠重定向路由到/odometer
    redirect: '/odometer',
    children: []
  }
]

// 创建路由
const router: any = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
     * 动态添加路由
     * @param routeItem
     */
    const addDynamicRoute = (routeItem: MenuItem) => {
      if (routeItem.page) {
        router.addRoute('system', {
          path: routeItem.path,
          name: routeItem.page,
          meta: { title: routeItem.name, icon: routeItem.icon, requiresAuth: true },
          component: () => import(`@/views/system/${routeItem.page}.vue`)
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
  router.matcher = () => ({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
  })
}

// 路由前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  const tabsStore = tabs()
  if (to.meta.requiresAuth && to.path !== '/home') {
    tabsStore.addTab({
      data: { icon: to.meta.icon, path: to.path, title: to.meta.title }
    })
  }
  const { VITE_APP_TITLE, VITE_TITLE_SUFFIX } = import.meta.env
  /*设置页面标题和标题后缀*/
  document.title = to.meta.title ? to.meta.title + VITE_TITLE_SUFFIX : VITE_APP_TITLE
  const store = userStore() // 拿到用户对象id信息判断是否登录
  const hasUser = store.loginInfo.sysUser && store.loginInfo.sysUser.id
  const noPermissionPaths = ['/login', '/404'] // 定义无需登录的路由
  /*判断页面是否需要分页*/
  paginationPage.includes(to.name) ? (to.meta.pagination = true) : (to.meta.pagination = false)
  if (to.meta.requiresAuth && !hasUser) {
    // 用户没登录,  假如你当前跳转login页面，然后login页面没有用户信息，这个时候你再去往 login页面跳转，就会发生无限循环跳转
    // 获取缓存的用户数据
    //  如果to.path === '/login' 的时候   !noPermissionPaths.includes(to.path) 是返回 false的，也就不会进 next("/login")
    next('/login')
  } else {
    if (!to.matched.length) {
      next('/:catchAll(.*)')
    } else {
      next()
    }
  }
})

export default router
