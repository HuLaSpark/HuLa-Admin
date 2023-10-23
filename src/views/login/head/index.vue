<template>
  <div class="cn-en">
    <n-text depth="3">{{ version }}</n-text>
    <n-icon color="#ccc"><ArrowUpRight /></n-icon>
    <n-divider vertical />
    <div style="display: flex">
      <!--切换语言组件-->
      <Language />
    </div>
    <n-divider vertical />
    <!--切换主题色-->
    <n-switch :rubber-band="false" :value="THEME" :loading="loading" @update:value="switchTheme">
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
import { Moon, Sun, BrandGit, ArrowUpRight } from '@vicons/tabler'
import Language from '@/components/Language/index.vue'
import { delay } from 'lodash-es'
import { pkgJson } from '@/views/composables/aboutUs/model'

const { version } = pkgJson
const gitee = 'https://gitee.com/nongyehong'
const { locale, t } = i18n.global
const store = mainStore()
const loading = ref<boolean>(false)
const { THEME } = storeToRefs(store)
const { loginText, loginErrorType, loginErrorTitle, statusCode, emailMsg, codeMsg } = useLogin()

/*切换主题*/
const switchTheme = (value: boolean) => {
  loading.value = true
  delay(() => {
    loading.value = false
    THEME.value = value
    store.toggleTheme()
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

<style scoped>
@import '@/assets/css/login.css';
</style>
