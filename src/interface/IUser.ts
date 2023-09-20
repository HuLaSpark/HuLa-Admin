interface User {
  id: number
  userName: string
  password: string
  role: string
  uid: string
  email: string
  url: string
  createTime: string
  updateTime: string
}

interface parameter {
  pageNum: number
  pageSize: number
  username: string
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
export type { User, parameter, deleteId, value }
