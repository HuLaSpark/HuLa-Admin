import type { DataTableBaseColumn, DataTableColumns } from 'naive-ui'
import { NTag, NIcon, NIconWrapper, NSpace, NTooltip, NSwitch } from 'naive-ui'
import { pageUser } from '@/services/types'
import { RoleEnum } from '@/enums'
import { LetterR, LetterM, LetterU, TrashX, EditCircle, Power, X } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { Report } from 'notiflix'

const { t } = i18n.global
export const UserTable = (): DataTableColumns<pageUser> => {
  return [
    {
      type: 'selection',
      disabled(row: pageUser) {
        return row.role === RoleEnum.HL_SYS_ADMIN
      }
    },
    {
      title: '用户名',
      key: 'userName'
    },
    {
      title: '角色',
      key: 'role',
      render(row) {
        let roleText = row.role
        row.role === RoleEnum.HL_SYS_ADMIN
          ? (roleText = '超级管理员')
          : row.role === RoleEnum.HL_SYS_MANAGE
          ? (roleText = '管理员')
          : '普通用户'
        return h(
          NTag,
          {
            style: {
              borderRadius: '6px'
            },
            type:
              row.role === RoleEnum.HL_SYS_ADMIN ? 'error' : row.role === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success',
            bordered: false
          },
          {
            default: () => [
              h(NIcon, {
                component:
                  row.role === RoleEnum.HL_SYS_ADMIN ? LetterR : row.role === RoleEnum.HL_SYS_MANAGE ? LetterM : LetterU
              }),
              roleText
            ]
          }
        )
      }
    },
    statusColumn,
    {
      title: '邮箱',
      key: 'email'
    },
    {
      title: '手机号',
      key: 'mobile'
    },
    {
      title: '头像',
      key: 'avatar'
    },
    {
      title: '创建时间',
      key: 'createTime'
    },
    {
      title: '更新时间',
      key: 'updateTime'
    },
    {
      title: '操作',
      key: 'actions',
      render() {
        return h(
          NSpace,
          {
            justify: 'space-around'
          },
          {
            default: () => [
              h(
                NTooltip,
                {
                  trigger: 'hover'
                },
                {
                  trigger: () =>
                    h(
                      NIconWrapper,
                      {
                        size: 26,
                        borderRadius: 6,
                        color: '#d8eee2',
                        iconColor: '#189f57',
                        style: {
                          display: 'flex',
                          alignItems: 'center'
                        }
                      },
                      h(NIcon, {
                        size: 22,
                        style: 'cursor: pointer',
                        component: EditCircle
                      })
                    ),
                  default: () => t('edit')
                }
              ),
              h(
                NTooltip,
                {
                  trigger: 'hover'
                },
                {
                  trigger: () =>
                    h(
                      NIconWrapper,
                      {
                        size: 26,
                        borderRadius: 6,
                        color: '#f5dce1',
                        iconColor: '#ce304f',
                        style: {
                          display: 'flex',
                          alignItems: 'center'
                        }
                      },
                      h(NIcon, {
                        size: 22,
                        style: 'cursor: pointer',
                        component: TrashX
                      })
                    ),
                  default: () => t('delete')
                }
              )
            ]
          }
        )
      }
    }
  ]
}

/*受控过滤器*/
export const statusColumn = reactive<DataTableBaseColumn<pageUser>>({
  title: '状态',
  key: 'status',
  filterMultiple: false,
  filterOptionValue: null,
  sorter: 'default',
  filterOptions: [
    {
      label: '开启',
      value: 1
    },
    {
      label: '禁用',
      value: 0
    }
  ],
  render(row) {
    const active = ref<boolean>(true)
    active.value = row.status === 1
    return h(
      NSwitch,
      {
        value: active.value,
        'onUpdate:value': (value: boolean) => {
          if (row.role === RoleEnum.HL_SYS_ADMIN) {
            Report.warning('不允许修改' + RoleEnum.HL_SYS_ADMIN + '角色用户', '', '好吧，算你狠')
            return false
          }
          active.value = !value
          row.status = value ? 1 : 0
        }
      },
      {
        'checked-icon': () =>
          h(NIcon, {
            component: Power
          }),
        'unchecked-icon': () =>
          h(NIcon, {
            component: X
          }),
        checked: () => {
          return t('enable')
        },
        unchecked: () => {
          return t('forbidden')
        }
      }
    )
  },
  filter(value, row) {
    return row.status === value
  }
})
