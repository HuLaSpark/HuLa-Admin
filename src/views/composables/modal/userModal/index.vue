<template>
  <n-modal
    style="position: absolute; width: 480px; height: 600px; top: 50px; left: calc(50% - (250px)); border-radius: 8px"
    v-model:show="showModal"
    :close-on-esc="false"
    :mask-closable="false"
    preset="card"
    :title="title"
    :bordered="false">
    <template #header-extra>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon style="cursor: move; padding-right: 10px" size="20" v-drag :component="DragDrop" />
        </template>
        {{ t('drag') }}
      </n-tooltip>
    </template>
    <n-scrollbar style="max-height: 420px; padding-right: 20px">
      <!--自定义警告-->
      <AlertIze
        style="margin-bottom: 10px"
        img-url="./src/assets/svg/warning.svg"
        :enter-active="'animate__animated animate__bounceIn'"
        :leave-active="'animate__animated animate__fadeOutUp'"
        :title="t('warn')"
        :text="warn"
        :show="showWarn"
        @alertOff="showWarn = false" />

      <!--上传头像-->
      <n-space vertical align="center">
        <n-upload style="border-radius: 10px; margin-bottom: 10px" list-type="image-card" :max="1">点击上传</n-upload>
      </n-space>

      <n-form
        ref="formRef"
        label-placement="left"
        label-width="auto"
        :model="addData"
        :rules="rules"
        style="padding: 10px 0">
        <n-form-item :label="t('user_name')" path="userName">
          <n-input v-model:value="addData.userName" :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('nick_name')">
          <n-input v-model:value="addData.nickName" :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('email')" path="email">
          <n-input v-model:value="addData.email" :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('phone_number')">
          <n-input v-model:value="addData.mobile" :placeholder="t('placeholder')" />
        </n-form-item>
      </n-form>
    </n-scrollbar>
    <template #footer>
      <div style="display: flex; justify-content: space-between; gap: 10px">
        <n-button style="width: 50%" type="tertiary" secondary @click="showModal = false">取消</n-button>
        <n-button style="width: 50%" type="primary" secondary @click="showModal = false">保存</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { useBase } from '@/hooks/useBase'
import { i18n } from '@/i18n'
import UserVar from '@/views/composables/drawer/userDrawer/userVar'
import { AlertIze } from '@/customize'
import { DragDrop } from '@vicons/tabler'

const { t } = i18n.global
const { formRef, rules } = UserVar()
const { addData, warn, showWarn } = useBase()
const { title } = defineProps<{
  title: string
}>()
const showModal = ref(false)
defineExpose({ showModal })
/*解决vue-drag-resize输入框无法选择的问题*/
// const clickHandle = (e) => {
//   console.log(e)
//   if (e.target.nodeName === 'INPUT') {
//     e.target.focus()
//   }
// }
</script>

<style scoped>
/*输入框样式*/
:deep(.n-input) {
  border-radius: 8px;
}
</style>
