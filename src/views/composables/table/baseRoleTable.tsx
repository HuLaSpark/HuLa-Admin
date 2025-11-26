import type { DataTableColumns } from 'naive-ui'
import type { Ref } from 'vue'
import { NTag, NTooltip } from 'naive-ui'

type RoleRow = {
  id: string
  name: string
  code: string
  category?: string
  state?: boolean
  readonly?: boolean
  remarks?: string
  echoMap?: Record<string, any>
  createTime?: number | string
  updateTime?: number | string
}

const formatTime = (val: any) => {
  if (!val) return '-'
  const ts = typeof val === 'number' ? val : Number(val)
  const date = new Date(ts >= 1e12 ? ts : ts * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

export const baseRoleTable = (data: Ref<any[]>): { columns: Ref<DataTableColumns<RoleRow>> } => {
  const columns: Ref<DataTableColumns<RoleRow>> = ref([
    { title: '角色名', key: 'name' },
    { title: '编码', key: 'code' },
    {
      title: '类别',
      key: 'category',
      render: (row: RoleRow) => row.echoMap?.category || row.category || '-'
    },
    {
      title: '状态',
      key: 'state',
      render: (row: RoleRow) => h(NTag, { bordered: false, type: row.state ? 'success' : 'error', style: { borderRadius: '6px' } }, { default: () => (row.state ? '启用' : '禁用') })
    },
    {
      title: '内置',
      key: 'readonly',
      render: (row: RoleRow) => h(NTag, { bordered: false, type: row.readonly ? 'warning' : 'info', style: { borderRadius: '6px' } }, { default: () => (row.readonly ? '内置' : '自定义') })
    },
    { title: '备注', key: 'remarks', ellipsis: { tooltip: true } },
    {
      title: '创建时间',
      key: 'createTime',
      render: (row: RoleRow) =>
        h(NTooltip, null, {
          default: () => String(row.createTime || ''),
          trigger: () => h('p', { style: { fontWeight: 'bold' } }, formatTime(row.createTime))
        })
    },
    {
      title: '更新时间',
      key: 'updateTime',
      render: (row: RoleRow) =>
        h(NTooltip, null, {
          default: () => String(row.updateTime || ''),
          trigger: () => h('p', { style: { fontWeight: 'bold' } }, formatTime(row.updateTime))
        })
    }
  ])

  return { columns }
}