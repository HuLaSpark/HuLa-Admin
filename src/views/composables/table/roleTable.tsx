import type { Ref } from 'vue'
import { i18n } from '@/i18n'
import { pageUser } from '@/services/types'
import { handRelativeTime } from '@/utils/Day'
import { useBase } from '@/hooks/useBase'
import paging from '@/hooks/usePaging.ts'
import UserVar from '@/views/composables/drawer/userDrawer/userVar'
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NIcon, NIconWrapper, NPopconfirm, NSpace, NTag, NText, NTooltip } from 'naive-ui'
import { RCodeEnum, RoleEnum } from '@/enums'
import { EditCircle, TrashX } from '@vicons/tabler'
import apis from '@/services/apis'

/**
 * @param data 表格数据
 */
export const roleTable = (data: Ref<any[]>) => {
  const { t } = i18n.global
  const { pageNum, pageSize } = paging
  const { input } = UserVar()
  const { pagingLoad, contentData, rawData, showDrawer, total } = useBase()
  const checkedRowKeys = ref<DataTableRowKey[]>([])

  /*tsx渲染表格数据*/
  const columns: Ref<DataTableColumns<pageUser>> = ref([
    {
      type: 'selection',
      disabled(row: pageUser) {
        return row.role === RoleEnum.HL_ROOT
      }
    },
    {
      title: '角色标签',
      key: 'flag',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '角色名',
      key: 'name'
    },
    {
      title: t('create_time'),
      width: 120,
      key: 'createTime',
      render: (row) => {
        return (
          <NTooltip>
            {{
              default: () => row.createTime,
              trigger: () => <p style={{ fontWeight: 'bold' }}>{handRelativeTime(row.createTime)}</p>
            }}
          </NTooltip>
        )
      }
    },
    {
      title: t('update_time'),
      width: 120,
      key: 'updateTime',
      render: (row) => {
        return (
          <NTooltip>
            {{
              default: () => row.updateTime,
              trigger: () => <p style={{ fontWeight: 'bold' }}>{handRelativeTime(row.updateTime)}</p>
            }}
          </NTooltip>
        )
      }
    },
    {
      title: t('operation'),
      key: 'actions',
      width: 110,
      render: (row) => {
        return (
          <NSpace justify={'center'} size={20}>
            <NTooltip>
              {{
                default: () => t('edit'),
                trigger: () => (
                  <div onClick={() => handleEditTable(row.id)}>
                    <NIconWrapper size={26} borderRadius={6} color={'#d8eee2'} iconColor={'#189f57'}>
                      <NIcon size={22} style={{ cursor: 'pointer' }} component={EditCircle}></NIcon>
                    </NIconWrapper>
                  </div>
                )
              }}
            </NTooltip>

            <NTooltip>
              {{
                default: () => t('delete'),
                trigger: () => (
                  <NPopconfirm positive-button-props={{ type: 'error' }} onPositiveClick={() => handleDeleteTable(row)}>
                    {{
                      default: () => t('confirm_delete'),
                      trigger: () => (
                        <NIconWrapper size={26} borderRadius={6} color={'#f5dce1'} iconColor={'#ce304f'}>
                          <NIcon size={22} style={{ cursor: 'pointer' }} component={TrashX}></NIcon>
                        </NIconWrapper>
                      )
                    }}
                  </NPopconfirm>
                )
              }}
            </NTooltip>
          </NSpace>
        )
      }
    }
  ])

  /*编辑处理*/
  const handleEditTable = (rowId: string) => {
    showDrawer.value = true
    const findItem = data.value.find((item: pageUser) => item.id === rowId)
    if (findItem) {
      /*同时赋值给原始数据，用来判断表单是否被修改，编辑时是操作editedData数据的内容*/
      Object.assign(rawData.value, findItem)
      Object.assign(contentData.value, findItem)
    }
  }
  /*删除处理*/
  const handleDeleteTable = async ({ id, userName, uid }: pageUser) => {
    const res = await apis.deleteUser(id, userName, uid)
    if (res.code !== RCodeEnum.OK) {
      return window.$message.error(res.msg)
    }
    await pagingLoad(() =>
      apis.userPage({
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        userName: input.value
      })
    ).then(() => {
      window.$message.success(res.msg)
    })
  }

  /*分页处理*/
  const pagination = reactive({
    page: pageNum.value,
    pageSize: pageSize.value,
    pageSizes: [5, 10, 15],
    showSizePicker: true,
    showQuickJumper: true,
    prefix: () => {
      return (
        <div style={{ display: 'flex', alignItems: 'center', height: 'fit-content', gap: '10px' }}>
          <NTag
            bordered={false}
            type={'success'}
            style={{
              display: checkedRowKeys.value.length > 0 ? '' : 'none',
              padding: '0 20px',
              borderRadius: '6px'
            }}>
            选中了 {checkedRowKeys.value.length} 条数据
          </NTag>
          <NText>共 {total.value} 项</NText>
        </div>
      )
    },
    onChange: (page: number) => {
      pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize
      pagination.page = 1
    }
  })

  /*多选选中的方法*/
  const handleCheck = (rowKeys: DataTableRowKey[]) => {
    checkedRowKeys.value = rowKeys
  }

  return {
    columns,
    checkedRowKeys,
    pagination,
    handleCheck
  }
}
