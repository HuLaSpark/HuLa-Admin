<template>
  <div class="operation-list-box">
    <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
      <template #trigger>
        <n-icon :size="24" @click="showSearch"><Search /></n-icon>
      </template>
      {{ t('global_search') }}
    </n-tooltip>
  </div>
  <!--全局弹框-->
  <search-modal v-model:value="show" />
</template>

<script lang="ts" setup>
import { SearchModal } from './components'
import { Search } from '@vicons/tabler'
import { i18n } from '@/i18n'

defineOptions({ name: 'GlobalSearch' })

const { t } = i18n.global
const show = ref(false)
const showSearch = () => {
  show.value = true
}
</script>

<style scoped>
@import '@/assets/css/layout-header.css';
</style>
