/**
 * 全局枚举文件
 * 如果枚举值需要在全局使用，那么请在此文件中定义。其他枚举值请在对应的文件中定义。
 * 定义规则：
 *  枚举名：XxxEnum
 *  枚举值：全部大写，单词间用下划线分割
 */

/**请求响应码类型*/
export enum RCodeEnum {
  /**成功请求*/
  OK = '00000',
  /**请求错误*/
  FAIL = 'U00001',
  /**自定义成功提示*/
  SUCCESS = 'U00002',
  /**验证密码错误*/
  RENEW_PAW_ERROR = 'U00003',
  /**无权限*/
  UNAUTHORIZED = 'U00004',
  /**服务器出现问题*/
  EXCEPTION = 'U00005',
  /**超时未操作*/
  TIMEOUT = 'U00006'
}
/**权限类型*/
export enum FlagEnum {
  HL_SYS_ADMIN = 'error',
  HL_SYS_MANAGE = 'success',
  HL_SYS_USER = 'warning'
}

/**角色类型*/
export enum RoleEnum {
  HL_SYS_ADMIN = 'hl_sys_admin',
  HL_SYS_MANAGE = 'hl_sys_manage',
  HL_SYS_USER = 'hl_sys_user'
}
