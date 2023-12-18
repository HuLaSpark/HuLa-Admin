<template>
  <!--自定义alert-->
  <transition :enter-active-class="enterActive" :leave-active-class="leaveActive">
    <div v-if="show" class="alert">
      <div style="display: flex; align-items: center; gap: 20px">
        <img :src="imgUrl" style="width: 100px; height: 100px" alt="" />
        <div style="display: flex; flex-direction: column; gap: 5px">
          <span style="display: flex; align-items: center; gap: 5px; color: #ee9f20">
            <n-icon :size="20" :component="AlertTriangle" />{{ title }}
          </span>
          <span style="color: #606060">{{ text }}</span>
        </div>
      </div>
      <div style="padding: 5px 0; cursor: pointer" @click="alertOff">
        <n-icon :component="X" color="#606060" />
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { AlertTriangle, X } from '@vicons/tabler'

defineOptions({ name: 'AlertIze' })

const { title, text, show, imgUrl, leaveActive, enterActive } = defineProps<{
  imgUrl: string
  show: boolean
  title?: string
  text?: string
  enterActive: string
  leaveActive: string
}>()

const emits = defineEmits(['alertOff'])
const alertOff = () => {
  emits('alertOff')
}
</script>
<style scoped>
.alert {
  width: 100%;
  font-size: 14px;
  height: fit-content;
  background: #fcf5eb;
  box-sizing: border-box;
  padding: 0 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
