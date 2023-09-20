interface IState {
  loginInfo: {
    sysUser: {
      id: number
      uid: any
      role: string
    }
    roleName: string
    token: string
    menus: []
    auths: [{ auth: string }]
  }
}
export type { IState }
