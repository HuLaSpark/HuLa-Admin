interface Role {
  id: number
  name: string
  flag: string
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

export type { Role, parameter, deleteId, value }
