// 本地配置到 .env.dev 里面修改。生产配置在 .env.pro 里面
const prefix = import.meta.env.PROD ? import.meta.env.VITE_BASE_URL : ''

enum URL {
  /**无权限*/
  PASS = '/pass',
  /**系统用户*/
  USER = '/SysUser'
}

export default {
  login: `${prefix + URL.PASS}/login`,
  logout: `${prefix + URL.PASS}/logout`,
  renew: `${prefix + URL.PASS}/renew`,
  userPage: `${prefix + URL.USER}/page`,
  userCRUD: `${prefix + URL.USER}`
}
