import type { DataTableColumns } from 'naive-ui'
import type { Ref } from 'vue'
import { NTag, NTooltip } from 'naive-ui'
import { formatTime } from '@/utils/time'

type EmployeeRow = {
  id: string
  name: string
  userId: string
  positionId?: string
  positionStatus?: string
  activeStatus?: string
  state?: boolean
  echoMap?: Record<string, any>
  createTime?: number | string
  updateTime?: number | string
}

 

export const employeeTable = (data: Ref<any[]>): { columns: Ref<DataTableColumns<EmployeeRow>> } => {
  const columns: Ref<DataTableColumns<EmployeeRow>> = ref([
    { title: '员工姓名', key: 'name' },
    { title: '岗位ID', key: 'positionId' },
    {
      title: '职位状态',
      key: 'positionStatus',
      render: (row: EmployeeRow) => row.echoMap?.positionStatus || (row.positionStatus === '10' ? '在职' : row.positionStatus === '20' ? '离职' : '-')
    },
    {
      title: '激活状态',
      key: 'activeStatus',
      render: (row: EmployeeRow) => {
        const ok = row.activeStatus === '20'
        return h(NTag, { bordered: false, type: ok ? 'success' : 'warning', style: { borderRadius: '6px' } }, { default: () => (ok ? '已激活' : '未激活') })
      }
    },
    {
      title: '状态',
      key: 'state',
      render: (row: EmployeeRow) => h(NTag, { bordered: false, type: row.state ? 'success' : 'error', style: { borderRadius: '6px' } }, { default: () => (row.state ? '启用' : '禁用') })
    },
    {
      title: '创建时间',
      key: 'createTime',
      render: (row: EmployeeRow) =>
        h(NTooltip, null, {
          default: () => String(row.createTime || ''),
          trigger: () => h('p', { style: { fontWeight: 'bold' } }, formatTime(row.createTime))
        })
    },
    {
      title: '更新时间',
      key: 'updateTime',
      render: (row: EmployeeRow) =>
        h(NTooltip, null, {
          default: () => String(row.updateTime || ''),
          trigger: () => h('p', { style: { fontWeight: 'bold' } }, formatTime(row.updateTime))
        })
    }
  ])

  return { columns }
}