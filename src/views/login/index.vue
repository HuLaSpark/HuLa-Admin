<template>
    <div class="cn-en">
        <n-switch/>
        <p>{{ t('switch') }}</p>
        <div style="display: flex">
        </div>
    </div>
    <div class="login-logo">
        <img src="/vue.svg" alt="">
    </div>
    <div class="login">
        <h1>{{ t('login') }} WT</h1>
        <!-- 登录错误提示框 -->
<!--        <n-alert title="Error 类型" type="error">-->
<!--            I'm back in the U.S.S.R.-->
<!--        </n-alert>-->
        <!-- 登录表单 -->
        <n-card class="form">
            <n-form ref="formRef" :rules="rules as any" :model="formValue">
                <div style="margin: 10px 0">
                    <n-form-item path="userName" :label="t('un_or_el')" :show-require-mark="false" label-style="font-size: 14px;color: #cccccc">
                        <n-input v-model:value="formValue.userName" style="border-radius: 8px" :placeholder="t('input_username_email')">
                            <template #prefix>
                                <n-icon color="#000"><UserOutlined/></n-icon>
                            </template>
                        </n-input>
                    </n-form-item>

                    <div class="paw-title">
                        <p style="font-size: 14px;color: #cccccc">{{ t('password') }}</p>
                        <p style="font-size: 12px;color: #337ecc;cursor: pointer">{{ t('forgot_password') }}</p>
                    </div>
                    <n-form-item path="password" :label="t('password')" :show-label="false">
                        <n-input v-model:value="formValue.password" style="border-radius: 8px" :placeholder="t('input_paw')">
                            <template #prefix>
                                <n-icon color="#000"><UnlockOutlined/></n-icon>
                            </template>
                        </n-input>
                    </n-form-item>
                </div>

                <n-button type="primary" style="width: 100%" @click="handleValidateClick">Login
                </n-button>
            </n-form>
        </n-card>
        <div class="FirstVisit">
            <h1>{{ t('et_problems') }}</h1>
            <h2>{{ t('contact_admin') }}</h2>
        </div>
        <div class="BottomBar">

            <p>Copyright © 2022-2023 Nyh.All Rights Reserved.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {i18n} from "@/i18n"
import { UserOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import { FormInst, useMessage } from 'naive-ui'

const { t } = i18n.global
const message = useMessage()
const formRef = ref<FormInst | null>(null)

const formValue = ref({
    userName: "",
    password: ""
})

const rules = reactive({
    userName: {required: true, message: '请输入用户名或邮箱', trigger: 'blur'},
    password: {required: true, message: '请输入密码', trigger: 'blur'},
})

const handleValidateClick  = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
        if (!errors) {
            message.success('输入正确')
        } else {
            console.log(errors)
            message.error('输入错误')
        }
    })
}
</script>

<style scoped>
@import "@/assets/css/login.css";
</style>