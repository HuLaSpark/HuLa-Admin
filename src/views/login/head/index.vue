<template>
  <div class="cn-en">
    <n-text depth="3">{{ version }}</n-text>
    <n-icon color="#ccc"><ArrowUpRight /></n-icon>
    <n-divider vertical />
    <div style="display: flex; cursor: pointer">
      <!--切换语言组件-->
      <Language />
    </div>
    <n-divider vertical />
    <!--切换主题色-->
    <n-switch :rubber-band="false" :value="EYE_THEME" :loading="loading" @click="switchTheme">
      <template #checked-icon>
        <n-icon><Moon /></n-icon>
      </template>
      <template #unchecked-icon>
        <n-icon><Sun /></n-icon>
      </template>
      <template #checked>{{ t('dark_color') }}</template>
      <template #unchecked>{{ t('light_color') }}</template>
    </n-switch>
    <n-divider vertical />
    <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
      <template #trigger>
        <n-icon @click="linkOpen(gitee)" :size="22" class="link"><BrandGit /></n-icon>
      </template>
      gitee
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores/main'
import { i18n } from '@/i18n'
import { useLogin } from '@/hooks/useLogin'
import { ArrowUpRight, BrandGit, Moon, Sun } from '@vicons/tabler'
import Language from '@/components/language/index.vue'
import { delay } from 'lodash-es'
import { pkgJson } from '@/common/model.ts'

const { version } = pkgJson
const gitee = 'https://gitee.com/nongyehong'
const { locale, t } = i18n.global
const store = mainStore()
const loading = ref<boolean>(false)
const { EYE_THEME, ASIDE_COLOR } = storeToRefs(store)
const { loginText, loginErrorType, loginErrorTitle, statusCode, emailMsg, codeMsg } = useLogin()

/*切换主题*/
const switchTheme = (event: MouseEvent) => {
  loading.value = true
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  let isDark: boolean

  delay(() => {
    loading.value = false
    EYE_THEME.value = !EYE_THEME.value
    /*在登录页面设置了护眼模式就需要把其他的颜色给关闭*/
    ASIDE_COLOR.value = false
    store.toggleTheme()
    /*判断当前浏览器是否支持startViewTransition API*/
    if (document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        const root = document.documentElement
        isDark = root.classList.contains('dark')
        root.classList.remove(isDark ? 'dark' : 'light')
        root.classList.add(isDark ? 'light' : 'dark')
      })
      transition.ready.then(() => {
        const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
        document.documentElement.animate(
          {
            clipPath: isDark ? [...clipPath].reverse() : clipPath
          },
          {
            duration: 500,
            easing: 'ease-in',
            pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
          }
        )
      })
    }
  }, 500)
}

/*监听语言是否被切换，如何发生变化则调用i18n修改loginText*/
watch(locale, () => {
  loginText.value = t('login')
  emailMsg.value = t('change_paw')
  codeMsg.value = t('code_input')
  if (statusCode.value === '401') {
    loginErrorType.value = 'warning'
    loginErrorTitle.value = t('account_error')
  } else {
    loginErrorType.value = 'error'
    loginErrorTitle.value = t('login_error')
  }
})

//使用新窗口打开链接
const linkOpen = (val: any) => {
  window.open(val)
}
</script>

<style lang="scss">
@use '@/styles/scss/login';
@use '@/styles/scss/toggle-theme';
</style>
