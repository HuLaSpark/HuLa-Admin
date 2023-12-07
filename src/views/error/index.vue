<template>
  <div class="result">
    <div class="result box">
      <img src="@/assets/svg/404.svg" style="width: 380px; height: 380px" alt="" />
      <!-- $router.replace 跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上个页面 (直接替换当前页面) -->
      <n-button style="width: fit-content" secondary type="error" @click="$router.replace('/')">
        <n-icon :size="16" style="margin: 0 5px"><ArrowBack /></n-icon>{{ t('BD_board') }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
import { ArrowBack } from '@vicons/tabler'

const { t } = i18n.global
</script>

<style scoped>
.result {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  flex-direction: column;
  gap: 30px;
  padding: 50px 0;
}
</style>
