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
  SERVE_EXCEPTION = 'U00005',
  /**冻结*/
  STATE_EXCEPTION = 'U00006',
  /**数据重复*/
  REPEAT = 'U00007',
  /**参数校验失败*/
  PARAM_ERROR = 'U00008'
}
/**URL*/
export enum URLEnum {
  /**无权限*/
  PASS = '/pass',
  /**系统用户*/
  USER = '/SysUser',
  /**角色*/
  ROLE = '/SysRole',
  /**租户*/
  TENANT = '/SysTenant',
  /**IM服务*/
  IM = '/im'
}
/**权限类型*/
export enum FlagEnum {
  HL_ROOT = 'error',
  HL_SYS_MANAGE = 'success',
  HL_ORD_USER = 'warning'
}

/**角色类型*/
export enum RoleEnum {
  HL_ROOT = 'hl_root',
  HL_SYS_MANAGE = 'hl_sys_manage',
  HL_ORD_USER = 'hl_ord_user',
  HL_ORD_CS = 'hl_ord_cs'
}

/**角色类型前缀*/
export enum RoleFixEnum {
  HL_ROOT = 'hl_root',
  HL_SYS = 'hl_sys',
  HL_ORD = 'hl_ord'
}

/*全局状态类型*/
export enum GlobalStatusEnum {
  'default',
  'tertiary',
  'primary',
  'success',
  'info',
  'warning',
  'error'
}
