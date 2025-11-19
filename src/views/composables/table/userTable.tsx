import type { DataTableBaseColumn, DataTableColumns, DataTableRowKey } from 'naive-ui'
import {
  NAvatar,
  NButton,
  NIcon,
  NIconWrapper,
  NPopconfirm,
  NProgress,
  NSpace,
  NSwitch,
  NTag,
  NText,
  NTooltip
} from 'naive-ui'
import { pageUser } from '@/services/types'
import { i18n } from '@/i18n'
import type { Ref } from 'vue'
import { RCodeEnum, RoleEnum } from '@/enums'
import { EditCircle, LetterM, LetterR, LetterU, Minus, Power, TrashX, X } from '@vicons/tabler'
import { Report } from 'notiflix'
import { useAuth } from '@/hooks/useAuth'
import { handRelativeTime } from '@/utils/Day'
import { useBase } from '@/hooks/useBase'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging.ts'
import UserVar from '@/views/composables/drawer/userDrawer/userVar'

/**
 * @param data 表格数据
 */
export const userTable = (data: Ref<any[]>) => {
  const { t } = i18n.global
  const { pageNum, pageSize } = paging
  const { judgmentRole } = useAuth()
  const { input } = UserVar()
  const { pagingLoad, contentData, rawData, showDrawer, total } = useBase()
  const checkedRowKeys = ref<DataTableRowKey[]>([])

  // 用户画像弹窗引用
  const userProfileModalRef = ref<any>(null)

  /*受控过滤器*/
  const statusColumn = reactive<DataTableBaseColumn<pageUser>>({
    title: t('status'),
    key: 'status',
    width: 120,
    filterMultiple: false,
    filterOptionValue: null,
    sorter: 'default',
    filterOptions: [
      {
        label: t('enable'),
        value: 1
      },
      {
        label: t('forbidden'),
        value: 0
      }
    ],
    render: (row) => {
      const active = ref<boolean>(true)
      active.value = row.status === 1
      return (
        <NSwitch
          size={'small'}
          value={active.value}
          onUpdateValue={(value: boolean) => handleStatus(row, active, value)}>
          {{
            'checked-icon': () => <NIcon component={Power} />,
            'unchecked-icon': () => <NIcon component={X} />,
            checked: () => t('enable'),
            unchecked: () => t('forbidden')
          }}
        </NSwitch>
      )
    },
    filter(value, row) {
      return row.status === value
    }
  })
  /*tsx渲染表格数据*/
  const columns: Ref<DataTableColumns<pageUser>> = ref([
    {
      type: 'selection',
      disabled(row: pageUser) {
        return row.role === RoleEnum.HL_ROOT
      }
    },
    {
      title: t('user'),
      key: 'userName',
      width: 230,
      render: (row) => {
        return (
          <NSpace justify={'start'} align={'center'}>
            <div
              class="user-avatar-wrapper"
              onClick={() => handleShowProfile(row)}>
              <NAvatar
                size={'large'}
                src={row.avatar || '/logoD.png'}
                fallbackSrc={'/logoD.png'}
              ></NAvatar>
            </div>
            <NSpace vertical size={5}>
              <p
                style={{
                  fontWeight: 'bold',
                  padding: 0,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px'
                }}>
                {row.nickName ? row.nickName : row.email}
              </p>
              <p style={{ color: '#ccc', fontSize: '12px', transform: 'scale(1)', padding: 0, margin: 0 }}>
                {row.userName}
              </p>
            </NSpace>
          </NSpace>
        )
      }
    },
    {
      title: t('email'),
      key: 'email',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: t('phone_number'),
      key: 'mobile',
      render: (row) => {
        return row.mobile ? row.mobile : <NIcon component={Minus} />
      }
    },
    {
      title: t('avatar'),
      key: 'avatar',
      render: (row) => {
        return row.avatar ? row.avatar : <NIcon component={Minus} />
      }
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
      title: t('role_flag'),
      key: 'role',
      render: (row) => {
        const roleText = judgmentRole(row.role as RoleEnum)
        const roleIcon = getRoleIcon(row.role)
        const roleType = getRoleType(row.role)
        return (
          <NTag style={{ borderRadius: '6px' }} bordered={false} type={roleType}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <NIcon component={roleIcon}></NIcon>
              {roleText}
            </div>
          </NTag>
        )
      }
    },
    {
      title: t('data_integrity'),
      key: 'integrity',
      width: 180,
      render: (row) => {
        const integrity = calculateIntegrity(row)
        const color = getColor(integrity)
        const railColor = getRailColor(integrity)
        const { show, status, cursor } = getMustStatus(integrity)
        return (
          <NPopconfirm trigger={show as any} negative-text={null} positive-text={null}>
            {{
              default: () => '请补全资料信息',
              trigger: () => (
                <NProgress
                  style={{ cursor }}
                  height={8}
                  color={color}
                  status={status as any}
                  rail-color={railColor}
                  percentage={integrity}
                  processing={integrity !== 100}
                />
              ),
              action: () => (
                <NButton quaternary type={'warning'} size={'tiny'} onClick={() => handleEditTable(row.id)}>
                  去修改
                </NButton>
              )
            }}
          </NPopconfirm>
        )
      }
    },
    statusColumn,
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

  /*显示用户画像*/
  const handleShowProfile = (row: pageUser) => {
    if (userProfileModalRef.value) {
      userProfileModalRef.value.openProfile(row)
    }
  }

  return {
    columns,
    statusColumn,
    pagination,
    checkedRowKeys,
    handleCheck,
    userProfileModalRef,
    handleShowProfile
  }
}

/**
 * 计算资料完整度
 * @param row
 */
function calculateIntegrity(row: pageUser) {
  // 统计null值的数量
  const nullCount = Object.values(row).filter((value) => value === null).length
  // 计算资料完整度的占比
  const totalDataCount = Object.keys(row).length
  return (1 - nullCount / totalDataCount) * 100
}

/**
 * 处理是否启用的状态
 * @param row 对应表单项
 * @param active 是否选中
 * @param value 切换的值
 */
function handleStatus(row: pageUser, active: Ref, value: boolean) {
  if (row.role === RoleEnum.HL_ROOT) {
    Report.warning('不允许修改' + RoleEnum.HL_ROOT + '角色用户', '', '好吧，算你狠')
    return false
  }
  active.value = !value
  row.status = value ? 1 : 0
}

/**
 * 抽取方法，获取必须的值
 * @param integrity 完整度
 */
function getMustStatus(integrity: number) {
  const show = integrity <= 80 ? 'hover' : ''
  const cursor = integrity <= 80 ? 'pointer' : ''
  const status = integrity === 100 ? 'success' : integrity <= 80 ? 'warning' : ''
  return { show, cursor, status }
}

/*进度条颜色*/
function getColor(integrity: number) {
  switch (true) {
    case integrity > 80:
      return 'rgb(33,163,93)'
    case integrity > 40:
      return 'rgb(238,159,32)'
    default:
      return 'rgb(212,75,103)'
  }
}
/*进度条背景颜色*/
function getRailColor(integrity: number) {
  switch (true) {
    case integrity > 80:
      return 'rgba(33,163,93,0.2)'
    case integrity > 40:
      return 'rgba(238,159,32,0.2)'
    default:
      return 'rgba(212,75,103,0.2)'
  }
}
/*获取角色图标*/
function getRoleIcon(role: string) {
  switch (role) {
    case RoleEnum.HL_ROOT:
      return LetterR
    case RoleEnum.HL_SYS_MANAGE:
      return LetterM
    default:
      return LetterU
  }
}
/*获取角色类型颜色*/
function getRoleType(role: string) {
  switch (role) {
    case RoleEnum.HL_ROOT:
      return 'error'
    case RoleEnum.HL_SYS_MANAGE:
      return 'info'
    default:
      return 'success'
  }
}
