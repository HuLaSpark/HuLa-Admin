<template>
  <div class="result">
    <n-result status="error" :title="t('error_tip')" :description="t('not_found')">
      <template #footer>
        <!-- $router.replace 跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上个页面 (直接替换当前页面) -->
        <n-button secondary type="error" @click="$router.replace('/odometer')"
          ><n-icon :size="16" style="margin: 0 5px"><ArrowBack /></n-icon>{{ t('BD_board') }}</n-button
        >
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
import { ArrowBack } from '@vicons/tabler'

const { t } = i18n.global
</script>

<style scoped>
.result {
  padding: 20px;
}
</style>
