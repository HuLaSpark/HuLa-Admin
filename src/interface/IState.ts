interface IState {
  loginInfo: {
    sysUser: {
      id: number
      uid: string
      tenantId: string
      role: string
    }
    companyName: string
    token: string
    menus: []
    auths: [{ auth: string }]
  }
}
export type { IState }
