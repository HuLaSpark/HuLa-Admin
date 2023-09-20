<template>
  <!-- 用户超时未操作验证模态框-->
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <modal :show="show" :width="'300px'" @close="show = false" class="verify-model">
      <template #header>
        <h3 class="msg">{{ msg }}</h3>
      </template>
      <template #body>
        <p style="margin: 0; text-align: center">{{ t('timeout_verify') }}</p>
        <n-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules as any">
          <n-form-item path="password">
            <n-input
              style="border-radius: 8px"
              type="password"
              :placeholder="t('input_paw')"
              v-model:value="ruleForm.password"
              show-password-on="mousedown"
              clearable />
          </n-form-item>
          <div style="display: flex; justify-content: center">
            <n-button v-if="butShow" quaternary type="primary" @click="debounce(verify, 1000, true)">
              {{ t('verify') }}
            </n-button>
            <n-button v-else quaternary type="error" @click="debounce(userExit, 1000, true)">
              {{ t('no_verify_exit') }}
            </n-button>
          </div>
        </n-form>
      </template>
      <template #footer>
        <div style="visibility: visible"></div>
      </template>
    </modal>
  </Teleport>
</template>

<script setup lang="ts">
import Modal from '@/components/modal/index.vue'
import useTimeout from '@/components/modal/timeout/index'
/*引入防抖函数来防止用户过度点击验证发送过多错误请求*/
import { debounce, clear } from '@/components/debounce'
import check from '@/hooks/useCheck'
import { useLogin } from '@/hooks/useLogin'
import { userStore } from '@/stores/user'
import { i18n } from '@/i18n'
import { Loading } from 'notiflix'
import { delay } from 'lodash-es'

const { t } = i18n.global
const userInfoStore = userStore()
const uid = userInfoStore.getUserUId
const userExit = () => {
  Loading.hourglass()
  delay(() => {
    userInfoStore.logout()
    useLogin()
      .exit(uid)
      .then(() => (show.value = false))
  }, 1000)
}
const { butShow, validateRenewPassword } = check()
const rules = reactive({
  password: [{ required: true, asyncValidator: validateRenewPassword, trigger: 'blur' }]
})
const { show, msg, ruleForm, verify } = useTimeout()
/*页面销毁前 清除定时器*/
onBeforeUnmount(() => {
  clear()
})
</script>

<style scoped>
.verify-model {
  margin: 0 auto;
}

.msg {
  background: #fdeae8;
  height: 40px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  line-height: 40px;
  font-weight: bold;
  font-size: 14px;
  border-radius: 5px;
}
</style>
