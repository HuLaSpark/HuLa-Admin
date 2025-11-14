<template>
  <n-select
    :render-tag="renderTag"
    v-model:value="contentData.role"
    v-model:show="showSelect"
    :placeholder="t('select')"
    :render-label="renderLabel"
    :loading="loadingSelect"
    :on-focus="handleShowSelect"
    clearable
    remote
    :options="selectData">
    <template #arrow>
      <transition name="slide-left">
        <UserCheck v-if="showSelect" />
        <UserSearch v-else />
      </transition>
    </template>
  </n-select>
</template>

<script setup lang="tsx">
import type { SelectOption, SelectRenderTag } from 'naive-ui'
import { NIcon, NTag } from 'naive-ui'
import type { VNodeChild } from 'vue'
import UserVar from '@/views/composables/drawer/userDrawer/userVar'
import { LetterM, LetterR, LetterU, UserCheck, UserSearch } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { delay } from 'lodash-es'
import apis from '@/services/apis'
import { Role } from '@/services/types'
import { userStore } from '@/stores/user'
import { RoleEnum, RoleFixEnum } from '@/enums'
import { renderMessage } from '@/customize'
import { useAuth } from '@/hooks/useAuth'
import { useBase } from '@/hooks/useBase'

const { t } = i18n.global
const { showSelect, loadingSelect, selectData } = UserVar()
const { contentData } = useBase()
const { judgmentRole } = useAuth()

/*点击选中框后进行异步查询选项框内容*/
const handleShowSelect = () => {
  if (selectData.value.length > 0) return
  loadingSelect.value = true
  delay(() => {
    apis.getRoleList().then((r: any) => {
      // 使用一个 Map 来存储 group 的数据，以 flag 作为键
      const groupMap = new Map<
        string,
        {
          type: string
          label: string
          key: string
          children: Array<{ label: string; value: string; disabled?: boolean }>
        }
      >()

      // 获取当前登录用户的角色
      const userRole = userStore().getRole
      // 遍历角色数据并更新 groupMap
      r.data.forEach((role: Role) => {
        const label = getLabelForRole(role.flag)
        if (!groupMap.has(label)) {
          // 如果组不存在，创建一个新的组
          groupMap.set(label, {
            type: 'group',
            label: label,
            key: role.id,
            children: []
          })
        }
        // 找到对应的组，将数据添加到 children 中
        const existingGroup = groupMap.get(label) as any
        const disabled = userRole !== 'hl_root' && role.flag === RoleEnum.HL_ROOT
        existingGroup.children.push({
          label: role.name,
          value: role.flag,
          disabled
        })
      })

      // 最后，将 groupMap 中的数据转为一个数组，作为 selectData.value
      selectData.value = Array.from(groupMap.values())
      loadingSelect.value = false
    })
  }, 500)
}
/*判断用户的等级分组*/
const getLabelForRole = (flag: string) => {
  // 根据 flag 的前缀来判断权限等级
  if (flag.startsWith(RoleFixEnum.HL_ROOT)) {
    return t('super_per')
  } else if (flag.startsWith(RoleFixEnum.HL_SYS)) {
    return t('advanced_per')
  } else if (flag.startsWith(RoleFixEnum.HL_ORD)) {
    return t('common_per')
  } else {
    return 'Unknown'
  }
}
/*选项框分组*/
const renderLabel = (option: SelectOption): VNodeChild => {
  if (option.type === 'group') return option.label + '(Cool!)'
  return (
    <div
      onClick={() => {
        if (option.disabled) {
          handleDisableValue(option.label as string)
        }
      }}>
      <NTag
        disabled={option.disabled}
        style={{ borderRadius: '6px' }}
        bordered={false}
        type={
          option.value === RoleEnum.HL_ROOT ? 'error' : option.value === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success'
        }>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NIcon
            component={
              option.value === RoleEnum.HL_ROOT ? LetterR : option.value === RoleEnum.HL_SYS_MANAGE ? LetterM : LetterU
            }></NIcon>
          {option.label as string}
        </div>
      </NTag>
    </div>
  )
}
/*渲染默认角色标签*/
const renderTag: SelectRenderTag = ({ option }) => {
  const roleText = judgmentRole(option.value as RoleEnum)
  return (
    <NTag
      style={{ borderRadius: '6px' }}
      bordered={false}
      type={option.value === RoleEnum.HL_ROOT ? 'error' : option.value === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <NIcon
          component={
            option.value === RoleEnum.HL_ROOT ? LetterR : option.value === RoleEnum.HL_SYS_MANAGE ? LetterM : LetterU
          }></NIcon>
        {roleText as string}
      </div>
    </NTag>
  )
}
/*选择禁用选项的提示*/
const handleDisableValue = (label: string) => {
  window.$message.error(label, {
    render: renderMessage,
    closable: true
  })
}
</script>

<style lang="scss" scoped></style>
