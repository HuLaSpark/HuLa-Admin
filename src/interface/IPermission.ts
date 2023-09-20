interface permission {
  id: number
  name: string
  path: string
  orders: number
  icon: string
  page: string
  auth: string
  pid: number
  type: number
  deleted: number
}

interface parameter {
  pageNum: number
  pageSize: number
  name: string
}

interface deleteId {
  id?: number
  ids?: number[]
}

interface value {
  code: string
  data?: any
  msg: string
}

export type { permission, deleteId, value, parameter }
