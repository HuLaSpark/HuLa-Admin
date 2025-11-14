<template>
  <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
    <template #trigger>
      <n-popover trigger="click">
        <template #trigger>
          <n-icon class="language" v-if="EYE_THEME" :size="24" :color="TEXT_COLOR"><Language /></n-icon>
          <n-icon class="language" v-else :size="24"><Language /></n-icon>
        </template>
        <n-space vertical class="n-button-hover">
          <n-text depth="3">
            {{ i18nStore.locale === 'zh-CN' ? '简体中文' : 'English' }}
          </n-text>
          <n-button
            :loading="loading"
            style="font-weight: bold"
            v-if="i18nStore.locale === 'en-US'"
            @click="chineseSwitch"
            quaternary>
            <span>简体中文</span>
            <n-icon color="#ccc"><ArrowUpRight /></n-icon>
          </n-button>
          <n-button :loading="loading" style="font-weight: bold" v-else @click="englishSwitch" quaternary>
            <span>English</span>
            <n-icon color="#ccc"><ArrowUpRight /></n-icon>
          </n-button>
        </n-space>
      </n-popover>
    </template>
    {{ t('switch') }}
  </n-tooltip>
</template>

<script setup lang="ts">
import { language } from '@/stores/i18n'
import { i18n } from '@/i18n'
import { ArrowUpRight, Language } from '@vicons/tabler'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { delay } from 'lodash-es'
import { dateZhCN, zhCN } from 'naive-ui'

/*获取App中的provide传来的naive-ui国际化配置*/
const NLanguage = ref(inject('NLanguage'))
const NDataLanguage = ref(inject('NDataLanguage'))
const i18nStore = language()
const store = mainStore()
const { TEXT_COLOR, EYE_THEME } = storeToRefs(store)
const { t, locale } = i18n.global
const loading = ref(false)

/*切换语言*/
const chineseSwitch = () => {
  loading.value = true
  delay(() => {
    loading.value = false
    NLanguage.value = zhCN
    NDataLanguage.value = dateZhCN
    i18nStore.setChinese()
    locale.value = i18nStore.locale as never
  }, 500)
}
const englishSwitch = () => {
  loading.value = true
  delay(() => {
    loading.value = false
    NLanguage.value = null
    NDataLanguage.value = null
    i18nStore.setEnglish()
    locale.value = i18nStore.locale as never
  }, 1000)
}
</script>

<style lang="scss" scoped>
@use '@/styles/scss/layout-header.scss';
.n-button-hover {
  font-weight: bold;
  .n-button:hover {
    color: #bc3f4a;
    span {
      animation: twinkle 0.3s ease-in-out;
    }
  }
  .n-text {
    margin-left: 13px;
  }
}
@keyframes twinkle {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
