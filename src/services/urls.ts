import { URLEnum } from '@/enums'

const { PROD, VITE_SERVICE_URL } = import.meta.env
// 本地配置到 .env.dev 里面修改。生产配置在 .env.prod 里面
const prefix = PROD ? VITE_SERVICE_URL : ''

export default {
  login: `${prefix + URLEnum.PASS}/login`,
  logout: `${prefix + URLEnum.PASS}/logout`,
  getPublicKey: `${prefix + URLEnum.PASS}/publicKey`,
  tenantList: `${prefix + URLEnum.TENANT}/tenantList`,
  renew: `${prefix + URLEnum.PASS}/renew`,
  user: `${prefix + URLEnum.USER}`,
  role: `${prefix + URLEnum.ROLE}`,
  // IM相关接口
  imUserSearch: `${prefix + URLEnum.IM}/user/search`,
  friendList: `${prefix + URLEnum.IM}/user/friend/page`
}
