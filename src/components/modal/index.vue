<template>
  <!--  封装模态框组件-->
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div :class="animation">
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>

        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>

        <div class="modal-footer">
          <slot name="footer"> default footer </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { animation } from '@/components/modal/type'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

const store = mainStore()
const { BGC, TEXT_COLOR } = storeToRefs(store)
/*传入是否需要显示show，和框体宽度width，不传入宽度就默认为auto*/
const { show, width } = defineProps<{
  show: boolean
  width?: string
}>()
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: v-bind(width);
  margin: auto;
  padding: 20px 30px;
  background-color: v-bind(BGC);
  color: v-bind(TEXT_COLOR);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

:deep(.modal-header h3) {
  margin-top: 0;
  color: #bc3f4a;
}

.modal-body {
  margin: 20px 0;
}
</style>
