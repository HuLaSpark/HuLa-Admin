import { defineStore } from 'pinia'

interface ITenant {
  tenant: {
    tenantName: string
    tenantId: string
    tenantUrl: string
  }
}
export const tenant = defineStore('tenant', {
  state: (): ITenant =>
    <ITenant>{
      tenant: {}
    },
  getters: {
    getTenant(): any {
      return this.tenant || ''
    }
  },
  actions: {
    setTenant(value: any) {
      this.tenant = JSON.parse(JSON.stringify(value))
    },
    deleteTenant() {
      this.$reset()
      //删除localStorage中记住的信息
      localStorage.removeItem('tenant')
    }
  },
  //开启数据持久化
  persist: true
})
