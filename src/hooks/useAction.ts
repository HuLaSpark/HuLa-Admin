import useUser from '@/hooks/useSystem/useUser'
import useRole from '@/hooks/useSystem/useRole'
import typeState from '@/hooks/useState'
import { computed, nextTick } from 'vue'
import { i18n } from '@/i18n'
import useInfo from '@/hooks/useInfo'

export const useAction = () => {
  const { t } = i18n.global
  const {
    AddOrEdit,
    ruleFormRef,
    state,
    originalForm,
    alertType,
    alert,
    alertTitle,
    alertContent,
    originalTree,
    isDispose
  } = typeState

  /**
   * 封装新增和编辑功能
   * @param actions 新增为‘Add’,编辑为‘Edit’
   * @param drawerVal 抽屉框是否显示
   * @param row 表单内容，新增则传null
   * @param InitParamFn 在新增的时候是否传入初始化方法
   */
  const action = (actions: string, drawerVal: boolean, row: any, InitParamFn?: () => void) => {
    const { permissionTreeRef } = useRole()
    const { originalAvatarUrl, originalUserName } = useUser()
    AddOrEdit.value = actions
    state.form = row ? JSON.parse(JSON.stringify(row)) : {}
    if (actions === 'Edit') {
      // 判断车辆违章是否已经处理
      isDispose.value = state.form.status === '已处理'
      // 不显示默认提示
      alert.value = false
      // 在编辑操作中保存原始表单的值,用于判断用户是否修改了数据
      originalForm.value = { ...state.form }
      // 记录原头像URL
      originalAvatarUrl.value = state.form.url
      // 记录原始的用户名
      originalUserName.value = state.form.userName
      // 初始化，默认不选择任何节点
      nextTick(() => {
        if (permissionTreeRef.value) {
          permissionTreeRef.value.setCheckedKeys([])
          state.form.permissionIds.forEach((v: any) => {
            permissionTreeRef.value.setChecked(v, true, false) // 给权限树设置选中的节点
          })
          /*点击编辑后先保存原始的全部选中节点*/
          // 目前选中的节点
          const checked = permissionTreeRef.value.getCheckedKeys()
          // 半选中节点
          const halfChecked = permissionTreeRef.value.getHalfCheckedKeys()
          // 组合全部节点
          checked.unshift(...checked, ...halfChecked)
          originalTree.value = checked
        }
      })
    } else {
      /*判断调用时候是否传入初始化参数方法*/
      if (InitParamFn) {
        InitParamFn()
      }
      if (permissionTreeRef.value) {
        permissionTreeRef.value.setCheckedKeys([])
      }
      //初始化表单状态
      ruleFormRef.value?.resetFields()
      alert.value = true
      isDispose.value = false
      alertType.value = 'warning'
      alertTitle.value = t('warm_reminder')
      alertContent.value = t('warm_reminder_description')
    }
  }

  //判断当前按钮是新增还是编辑
  const showButton = computed(() => {
    return AddOrEdit.value === 'Add' || AddOrEdit.value === 'Edit'
  })

  //集成i18n翻译按钮文本
  const buttonText = computed(() => {
    return AddOrEdit.value === 'Add' ? t('add') : t('save')
  })

  /**
   * 处理点击事件
   * @param val 需要传入表单数据校验状态
   * @param BeTrueFn 为真时候执行的方法
   * @param BeFalseFn 为假时候执行的方法
   */
  const handleClick = (val: any, BeTrueFn: (val: string) => void, BeFalseFn: (val: string) => void) => {
    AddOrEdit.value === 'Add' ? BeTrueFn(val) : BeFalseFn(val)
  }

  /**
   * 检查表单内容是否被修改过
   * @param form 表单
   */
  const checkModification = (form: any) => {
    if (JSON.stringify(form) === JSON.stringify(originalForm.value)) {
      alert.value = true
      alertTitle.value = t('alert_warning_title')
      alertType.value = 'warning'
      alertContent.value = t('alert_warning_description')
      return false
    }
    return true
  }

  /*检查权限树是否被修改*/
  const checkTreeModification = () => {
    const compareArrays = (arr1: any[], arr2: any[]) => {
      if (arr1.length !== arr2.length) {
        return false
      }
      for (let i = 0; i < arr1.length; i++) {
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
          if (!compareArrays(arr1[i], arr2[i])) {
            return false
          }
        } else if (arr1[i] !== arr2[i]) {
          return false
        }
      }
      return true
    }

    // 检查两个数组是否相等
    const areArraysEqual = compareArrays(state.form.permissionIds, originalTree.value)
    const oldRoleForm = JSON.stringify(state.form.name + state.form.flag)
    const newRoleForm = JSON.stringify(originalForm.value.name + originalForm.value.flag)
    if (areArraysEqual && oldRoleForm === newRoleForm) {
      alert.value = true
      alertTitle.value = t('alert_warning_title')
      alertType.value = 'warning'
      alertContent.value = t('alert_warning_description')
      return false
    }
    return true
  }

  /**
   * 用户信息抽屉框处理
   * @param row 用户信息内容
   */
  const infoAction = (row: any) => {
    const { load, infoDrawer, originalAvatarUrl, originalUserName, userInfo } = useInfo()
    load().then(() => {
      /*初始化表单内容*/
      userInfo.value = JSON.parse(JSON.stringify(row))
      infoDrawer.value = true
      // 不显示默认提示
      alert.value = false
      // 在编辑操作中保存原始表单的值,用于判断用户是否修改了数据
      originalForm.value = { ...userInfo.value }
      // 记录原头像URL
      originalAvatarUrl.value = userInfo.value.url
      // 记录原始的用户名
      originalUserName.value = userInfo.value.userName
    })
  }

  return {
    showButton,
    buttonText,
    action,
    handleClick,
    checkModification,
    checkTreeModification,
    infoAction
  }
}
