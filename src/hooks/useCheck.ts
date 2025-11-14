import typeState from '@/hooks/useState.ts'
import { ref } from 'vue'
import { i18n } from '@/i18n'
import { RegExp } from '@/utils/RegExp.ts'

const { tagType1, tagType2, tagType3, passwordComplexity, complexityShow, ValidationStatus } = typeState
const butShow = ref<boolean>()
const { t } = i18n.global

/**
 * 校验登录用户名方法
 * @param _rule 规则
 * @param value 表单的内容的值
 * @param callback 回调函数
 */
const validateLoginUsername = (_rule: any, value: any, callback: any) => {
  // TODO 验证函数只在值变更时运行一次，并且错误信息只在这个时候生成。如果之后用户更改了语言，这个错误信息将不会自动更新 (nyh-2023-12-11 17:09:05)
  if (!value) {
    callback(new Error(t('input_username')))
  } else if (value.length > 50) {
    // 放宽限制：只限制最大长度为50，允许任何字符（包括中文、特殊字符等）
    callback(new Error(t('UN_EX_limit')))
  } else {
    callback()
  }
}
/**
 * 校验登录密码方法
 * @param _rule 规则
 * @param value 表单的内容的值
 * @param callback 回调函数
 */
const validatePassword = (_rule: any, value: any, callback: any) => {
  if (value === '' || value === undefined) {
    ValidationStatus.value = 'error'
    callback(new Error(t('input_paw')))
  } else {
    // 移除密码长度限制和延迟验证，允许任何非空密码
    ValidationStatus.value = ''
    callback()
  }
}
// TODO 这些校验还需要解决一些bug
const validateCreatePassword = (_rule: any, value: any, callback: any) => {
  if (value === '' || value === undefined) {
    complexityShow.value = false
    callback(new Error(t('input_paw')))
  } else {
    setTimeout(() => {
      if (value.length < 6) {
        complexityShow.value = false
        callback(new Error(t('paw_length')))
      } else if (value.length > 15) {
        complexityShow.value = false
        callback(new Error(t('paw_exceed_length')))
      } else {
        complexityShow.value = true
        callback()
      }
    }, 1000)
  }
}

const validateRenewPassword = (_rule: any, value: any, callback: any) => {
  if (value === '' || value === undefined) {
    butShow.value = false
    callback(new Error(t('input_paw')))
  } else {
    if (value.length < 6) {
      butShow.value = false
      callback(new Error(t('paw_length')))
    } else {
      butShow.value = true
      callback()
    }
  }
}

const validateIsNull = (_rule: any, value: any, callback: any) => {
  if (value === '' || value === undefined) {
    callback(new Error(t('no_null')))
  } else {
    callback()
  }
}

/**
 * 校验邮箱格式
 * @param _rule 规则
 * @param value 表单的内容的值
 * @param callback 回调函数
 */
const validateEmail = (_rule: any, value: any, callback: any) => {
  if (value === '' || value === undefined) {
    callback(new Error(t('no_null')))
  } else if (!RegExp.isEmail(value)) {
    callback(new Error(t('check_email')))
  } else {
    callback()
  }
}

/**
 * 校验密码的复杂度
 * @param val 表单中的密码字段
 */
const pawComplexity = (val: any) => {
  complexityShow.value = true
  if (RegExp.isPasswordComplex(val)) {
    passwordComplexity.value = t('complexity_st')
    tagType1.value = 'success'
    tagType2.value = 'success'
    tagType3.value = 'success'
  } else if (val?.length >= 6) {
    passwordComplexity.value = t('complexity_m')
    tagType1.value = 'warning'
    tagType2.value = 'warning'
    tagType3.value = 'info'
  } else {
    passwordComplexity.value = t('complexity_s')
    tagType1.value = 'danger'
    tagType2.value = 'info'
    tagType3.value = 'info'
  }
}

export default () => ({
  butShow,
  validateLoginUsername,
  validatePassword,
  validateRenewPassword,
  validateIsNull,
  validateCreatePassword,
  validateEmail,
  pawComplexity
})
