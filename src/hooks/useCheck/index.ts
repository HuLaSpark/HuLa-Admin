import { WithNameQuery } from '@/api/user'
import typeState from '@/hooks/useState'
import { ref } from 'vue'
import { i18n } from '@/i18n'
import { StringUtils } from '@/utils/StringUtils'

const { AddOrEdit, tagType1, tagType2, tagType3, passwordComplexity, complexityShow, loadingPaw, ValidationStatus } =
  typeState
const butShow = ref<boolean>()
const { t } = i18n.global

/**
 * @description 校验登录用户名方法
 * @param rule 规则
 * @param value 表单的内容的值
 * @param callback 回调函数
 */
const validateLoginUsername = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error(t('input_username')))
  } else if (!StringUtils.isStandard(value) || value.length > 12) {
    callback(new Error(t(!StringUtils.isStandard(value) ? 'is_standard' : 'UN_EX_limit')))
  } else {
    callback()
  }
}
/**
 * @description 校验登录密码方法
 * @param rule 规则
 * @param value 表单的内容的值
 * @param callback 回调函数
 */
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '' || value === undefined) {
    ValidationStatus.value = 'error'
    callback(new Error(t('input_paw')))
  } else {
    loadingPaw.value = true
    setTimeout(() => {
      if (value.length < 6) {
        ValidationStatus.value = 'warning'
        callback(t('paw_length'))
        loadingPaw.value = false
      } else {
        ValidationStatus.value = ''
        callback()
        loadingPaw.value = false
      }
    }, 1000)
  }
}

//创建时候校验数据方法
const validateCreateUsername = (rule: any, value: any, callback: any) => {
  if (AddOrEdit.value === 'Edit') {
    if (value === '' || value === undefined) {
      callback(new Error(t('input_username')))
    } else {
      callback()
    }
  } else {
    if (value === '' || value === undefined) {
      callback(new Error(t('input_username')))
    } else {
      WithNameQuery(value).then((res) => {
        setTimeout(() => {
          if (res.code === '00000') {
            callback()
          } else {
            callback(new Error(t('username_exist')))
          }
        }, 1000)
      })
    }
  }
}
// TODO 这些校验还需要解决一些bug
const validateCreatePassword = (rule: any, value: any, callback: any) => {
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

const validateRenewPassword = (rule: any, value: any, callback: any) => {
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

const validateIsNull = (rule: any, value: any, callback: any) => {
  if (value === '' || value === undefined) {
    callback(new Error(t('no_null')))
  } else {
    callback()
  }
}

/**
 * 校验邮箱格式
 * @param rule 规则
 * @param value 表单的内容的值
 * @param callback 回调函数
 */
const validateEmail = (rule: any, value: any, callback: any) => {
  if (value === '' || value === undefined) {
    callback(new Error(t('no_null')))
  } else if (!StringUtils.isEmail(value)) {
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
  if (StringUtils.isPasswordComplex(val)) {
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
  validateCreateUsername,
  validateRenewPassword,
  validateIsNull,
  validateCreatePassword,
  validateEmail,
  pawComplexity
})
