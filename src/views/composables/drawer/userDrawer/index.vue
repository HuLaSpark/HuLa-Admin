<template>
  <!--抽屉-->
  <n-drawer
    to="#drawer-target"
    v-model:show="showDrawer"
    :width="350"
    :on-mask-click="clone"
    :on-esc="clone"
    :close-on-esc="false">
    <n-drawer-content :title="t('edit')" :native-scrollbar="false">
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
        <n-upload style="border-radius: 10px" list-type="image-card" :max="1">点击上传</n-upload>
      </n-space>

      <n-form ref="formRef" :model="contentData" :rules="rules" style="padding: 10px 0">
        <n-form-item :label="t('user_name')" path="userName">
          <n-input
            :allow-input="Common.noSideSpace"
            v-model:value="contentData.userName"
            :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('nick_name')">
          <n-input
            :allow-input="Common.noSideSpace"
            :status="handleStatus(contentData.nickName)"
            v-model:value="contentData.nickName"
            :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('role_flag')" path="role">
          <RoleOptions />
        </n-form-item>
        <n-form-item :label="t('email')" path="email">
          <n-input disabled v-model:value="contentData.email" :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('phone_number')">
          <n-input disabled v-model:value="contentData.mobile" :placeholder="t('placeholder')" />
        </n-form-item>

        <n-space vertical :size="20">
          <n-space align="center">
            <span>创建于：</span>
            <n-tag :bordered="false" style="border-radius: 10px" type="primary">
              {{ handRelativeTime(contentData['createTime']) }}
            </n-tag>
          </n-space>

          <n-space align="center">
            <span>最后一次活动：</span>
            <n-tag :bordered="false" style="border-radius: 10px" type="info">
              {{ handRelativeTime(contentData['updateTime']) }}
            </n-tag>
          </n-space>
        </n-space>
      </n-form>
      <template #footer>
        <n-button style="width: 100%" :type="butType" :loading="loadingBut" secondary @click="saveData(formRef)">
          <template #icon>
            <n-icon v-if="iconShow" :component="butIcon" />
          </template>
          {{ butText }}
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>

  <!--  模态框-->
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <modal :show="showModal" width="300px" @close="showModal = false">
      <template #header>
        <h3>{{ t('confirm_close') }}</h3>
      </template>
      <template #body>
        <p>{{ t('no_save') }}</p>
      </template>
      <template #footer>
        <div style="display: flex; align-content: center; justify-content: space-between">
          <n-button quaternary type="tertiary" @click="cancel">{{ t('cancel') }}</n-button>
          <n-button secondary type="error" @click="shutDown(formRef)">{{ t('close') }}</n-button>
        </div>
      </template>
    </modal>
  </Teleport>
</template>

<script setup lang="ts">
import { NForm, NIcon, NTag } from 'naive-ui'
import { i18n } from '@/i18n'
import Modal from '@/components/modal/index.vue'
import { AlertCircle } from '@vicons/tabler'
import { isEqual } from 'lodash-es'
import { useBase } from '@/hooks/useBase'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging.ts'
import UserVar from './userVar'
import { AlertIze } from '@/customize'
import { handRelativeTime } from '@/utils/Day'
import { animation } from '@/components/modal/type'
import { Common } from '@/utils/Common'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const { input, showModal, formRef, rules } = UserVar()
const {
  performAction,
  textChange,
  contentData,
  rawData,
  butText,
  butType,
  butIcon,
  iconShow,
  warn,
  showDrawer,
  showWarn,
  loadingBut
} = useBase()

const handleStatus = (status: any) => {
  return status ? 'success' : 'warning'
}

/*保存事件*/
const saveData = async (formRef: InstanceType<typeof NForm>) => {
  // 判断是否修改了数据
  if (isEqual(rawData.value, contentData.value)) {
    showWarn.value = true
    warn.value = t('alert_warning_description')
    textChange(t('save_warning'), AlertCircle, 'warning')
    return
  }
  await performAction(
    formRef,
    () => apis.editUser(contentData.value),
    () =>
      apis.userPage({
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        userName: input.value
      })
  )
  // 清空临时对象
  // contentData.value = {} as pageUser
}

const clone = () => {
  // TODO animation是全局的值，如果当其他地方的值改变了，就要在其他地方初始化的时候来初始化动画 (nyh-2023-10-03 03:56:34)
  animation.value = 'modal-container animate__animated animate__shakeX'
  showModal.value = true
  showDrawer.value = true
}

/*关闭弹框*/
const shutDown = (formRef: InstanceType<typeof NForm>) => {
  animation.value = 'modal-container animate__animated animate__fadeOutLeft'
  setTimeout(() => {
    showModal.value = false
    showDrawer.value = false
    showWarn.value = false
    formRef.restoreValidation()
  }, 100)
}

/*取消*/
const cancel = () => {
  animation.value = 'modal-container animate__animated animate__fadeOutDown'
  setTimeout(() => {
    showModal.value = false
  }, 100)
}

/*在组件卸载之前执行把抽屉关闭(因为编辑抽屉不是全屏所以可以切换页面)*/
onBeforeUnmount(() => {
  showDrawer.value = false
})
</script>

<style scoped>
span {
  font-size: 14px;
}
/*上传框样式*/
:deep(.n-upload-file-list .n-upload-file.n-upload-file--image-card-type),
:deep(.n-upload-trigger.n-upload-trigger--image-card .n-upload-dragger) {
  border-radius: 10px;
}
/*输入框样式*/
:deep(.n-input) {
  border-radius: 8px;
}
/*选择框样式*/
:deep(.n-base-selection) {
  border-radius: 8px;
}
:deep(.slide-left-enter-active),
:deep(.slide-left-leave-active) {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

:deep(.slide-left-enter-from),
:deep(.slide-left-leave-to) {
  position: absolute;
  opacity: 0;
}

:deep(.slide-left-enter-from) {
  transform: translateX(-10px);
}

:deep(.slide-left-leave-to) {
  transform: translateX(10px);
}
/*end*/
</style>
