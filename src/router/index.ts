import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { userStore } from '@/stores/user'
import type { MenuItem } from '@/interface/IRouter'

const modules = import.meta.glob('../views/system/*.vue')
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
    // 开始渲染 未来的不确定的  用户添加的路由
    menus.forEach((item) => {
      // 所有的页面都需要设置路由，而目录不需要设置路由
      if (item.path) {
        // 当且仅当path不为空的时候才去设置路由
        router.addRoute('system', {
          path: item.path,
          name: item.page,
          component: modules['../views/system/' + item.page + '.vue']
        })
      } else {
        if (item.children && item.children.length) {
          item.children.forEach((sub) => {
            if (sub.path) {
              router.addRoute('system', {
                path: sub.path,
                name: sub.page,
                component: modules['../views/system/' + sub.page + '.vue']
              })
            }
          })
        }
      }
    })
  }
}

const router: any = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

//重置路由的方法
export const resetRouter = () => {
  router.matcher = () => ({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
  })
}

setRoutes()

// 路由守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  const store = userStore() // 拿到用户对象信息
  const user = store.loginInfo.sysUser
  const hasUser = user && user.id
  const noPermissionPaths = ['/login', '/404'] // 定义无需登录的路由
  if (!hasUser && !noPermissionPaths.includes(to.path)) {
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
