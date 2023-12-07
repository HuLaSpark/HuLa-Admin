import { URLEnum } from '@/enums'
// 本地配置到 .env.dev 里面修改。生产配置在 .env.pro 里面
const prefix = import.meta.env.PROD ? import.meta.env.VITE_BASE_URL : ''

export default {
  login: `${prefix + URLEnum.PASS}/login`,
  logout: `${prefix + URLEnum.PASS}/logout`,
  getPublicKey: `${prefix + URLEnum.PASS}/publicKey`,
  tenantList: `${prefix + URLEnum.TENANT}/tenantList`,
  renew: `${prefix + URLEnum.PASS}/renew`,
  user: `${prefix + URLEnum.USER}`,
  role: `${prefix + URLEnum.ROLE}`
}
