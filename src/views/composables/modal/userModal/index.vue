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
        :model="contentData"
        :rules="rules"
        style="padding: 10px 0">
        <n-form-item :label="t('user_name')" path="userName">
          <n-input
            :allow-input="Common.noSideSpace"
            v-model:value="contentData.userName"
            :placeholder="t('please_enter') + t('user_name')" />
        </n-form-item>
        <n-form-item :allow-input="Common.noSideSpace" :label="t('password')" path="password">
          <n-input v-model:value="contentData.password" :placeholder="t('please_enter') + t('password')" />
        </n-form-item>
        <n-form-item :label="t('role_flag')" path="role">
          <RoleOptions />
        </n-form-item>
        <n-form-item :label="t('email')" path="email">
          <n-auto-complete
            clearable
            v-model:value="contentData.email"
            :options="emailOptions"
            :placeholder="t('please_enter') + t('email')" />
        </n-form-item>
        <!--不是必填的选项进行隐藏-->
        <n-space justify="center" v-if="!showMore">
          <n-space style="cursor: pointer; color: #afabab" @click="showMore = true">
            <span>展开更多选项</span>
            <n-icon size="22" :component="Badges" />
          </n-space>
        </n-space>
        <n-collapse-transition v-show="showMore">
          <n-form-item :label="t('nick_name')">
            <n-input v-model:value="contentData.nickName" :placeholder="t('please_enter') + t('nick_name')" />
          </n-form-item>
          <n-form-item :label="t('phone_number')">
            <n-input v-model:value="contentData.mobile" :placeholder="t('please_enter') + t('phone_number')" />
          </n-form-item>
          <n-space justify="center">
            <n-space style="cursor: pointer; color: #afabab" @click="showMore = false">
              <span>收起</span>
              <n-icon size="22" :component="ArrowBigUpLines" />
            </n-space>
          </n-space>
        </n-collapse-transition>
      </n-form>
    </n-scrollbar>
    <template #footer>
      <div style="display: flex; justify-content: space-between; gap: 10px">
        <n-button style="width: 50%" type="tertiary" secondary @click="showModal = false">取消</n-button>
        <n-button style="width: 50%" :type="butType" secondary :loading="loadingBut" @click="save(formRef)">
          <template #icon>
            <n-icon v-if="iconShow" :component="butIcon" />
          </template>
          {{ butText }}
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { useBase } from '@/hooks/useBase'
import { i18n } from '@/i18n'
import UserVar from '@/views/composables/drawer/userDrawer/userVar'
import { AlertIze } from '@/customize'
import { ArrowBigUpLines, Badges, DragDrop } from '@vicons/tabler'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging.ts'
import { userStore } from '@/stores/user'
import { NIcon } from 'naive-ui'
import { Common } from '@/utils/Common'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const { formRef, rules, input } = UserVar()
const { performAction, contentData, warn, showWarn, butText, loadingBut, butType, butIcon, iconShow, showModal } =
  useBase()
const userInfoStore = userStore()
const tenantId = userInfoStore.getTenantId
const showMore = ref(false)
/*邮箱字段自动填充*/
const emailOptions = computed(() => {
  return [
    ['腾讯', '@qq.com'],
    ['网易', '@163.com'],
    ['新浪', '@sina.com'],
    ['搜狐', '@sohu.com'],
    ['谷歌', '@gmail.com']
  ].map((emailInfo) => {
    const email = contentData.value.email || ''
    return {
      type: 'group',
      label: emailInfo[0],
      key: emailInfo[0],
      children: [email.split('@')[0] + emailInfo[1]]
    }
  })
})
const { title } = defineProps<{
  title: string
}>()

/*保存*/
const save = async (form: any) => {
  /*!注入租户id*/
  const newData = { ...form.model, tenantId }
  await performAction(
    form,
    () => apis.addUser(newData),
    () =>
      apis.userPage({
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        userName: input.value
      })
  )
}
/*解决vue-drag-resize输入框无法选择的问题*/
// const clickHandle = (e) => {
//   console.log(e)
//   if (e.target.nodeName === 'INPUT') {
//     e.target.focus()
//   }
// }
</script>

<style scoped>
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
  transition: transform 0.3s ease, opacity 0.3s ease;
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
