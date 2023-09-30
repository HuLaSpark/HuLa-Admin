<template>
  <div class="countdown">
    <n-button quaternary :disabled="countdown > 0" @click="startCountdown(ruleFormRef)">
      {{ countdown > 0 ? `${countdown}s` : t('new_obtain_code') }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { i18n } from '@/i18n'
import { useLogin } from '@/hooks/useLogin'

const { t } = i18n.global

const { handleCodeInput } = useLogin()

const { time, ruleFormRef } = defineProps<{
  time: number
  ruleFormRef: any
}>()

const countdown = ref<number>(0)

const startCountdown = (ruleFormRef: any) => {
  if (countdown.value > 0) {
    return
  }
  countdown.value = time
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      handleCodeInput(ruleFormRef)
    }
  }, 1000)
}

/*开始进来就倒计时一次*/
onMounted(() => {
  startCountdown(ruleFormRef)
})
</script>

<style scoped>
.countdown {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
}
</style>
