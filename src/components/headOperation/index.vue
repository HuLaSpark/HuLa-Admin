<template>
  <div class="animate__animated animate__backInRight" style="margin: 10px 0; display: flex">
    <div style="flex: 1">
      <!--  按钮  -->
      <n-tooltip :content="t('refresh')" placement="top">
        <n-button text bg type="info" :icon="Refresh" @click="load" />
      </n-tooltip>
      <n-tooltip :content="t('add')" placement="top">
        <slot name="action">
          <n-button
            v-show="auths.includes(props.butAuth)"
            type="success"
            :icon="Plus"
            text
            bg
            @click="action('Add', true, null)"
            >{{ t('add') }}</n-button
          >
        </slot>
      </n-tooltip>
      <!--  批量删除(默认有批量删除) -->
      <slot name="insert-button">
        <n-popconfirm
          :disabled="deleteDisabled"
          :confirm-button-text="t('confirm')"
          :cancel-button-text="t('no')"
          :icon="InfoFilled"
          icon-color="red"
          :title="t('confirm_delete_batch')"
          @confirm="deleteBatch">
          <template #reference>
            <div class="delete-batch">
              <n-tooltip :content="t('delete_batch')" placement="top">
                <n-button type="danger" :icon="DeleteFilled" text bg>{{ t('delete_batch') }}</n-button>
              </n-tooltip>
            </div>
          </template>
        </n-popconfirm>
      </slot>

      <!--  搜索输入框  -->
      <slot name="input">default input</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAction } from '@/hooks/useAction'
import typeState from '@/hooks/useState'
import { i18n } from '@/i18n'
import { userStore } from '@/stores/user'

const user = userStore()
/*获取权限数据*/
const auths = user.getAuths
const { t } = i18n.global
/*解构状态类型参数*/
const { deleteDisabled } = typeState
const { action } = useAction()

const props = defineProps({
  load: { type: Function },
  deleteBatch: { type: Function, default: null },
  butAuth: { type: String, default: '' }
})
</script>

<style scoped>
.delete-batch {
  margin-left: 12px;
  display: inline-block;
}
</style>
