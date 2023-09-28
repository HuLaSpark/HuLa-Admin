import { FlagEnum, RoleEnum } from '@/enums'

type AuthMap = {
  [key: string]: FlagEnum
}

type RoleText = {
  [key in RoleEnum]: string
}

export const useAuth = () => {
  const judgmentAuth = (flag: keyof AuthMap) => {
    const authMap: AuthMap = {
      hl_root: FlagEnum.HL_ROOT,
      hl_sys_manage: FlagEnum.HL_SYS_MANAGE,
      hl_ord_user: FlagEnum.HL_ORD_USER
    }
    return authMap[flag] || 'info'
  }
  const judgmentRole = (flag: keyof RoleText) => {
    const roleText: RoleText = {
      [RoleEnum.HL_ROOT]: '超级管理员',
      [RoleEnum.HL_SYS_MANAGE]: '管理员',
      [RoleEnum.HL_ORD_USER]: '普通用户',
      [RoleEnum.HL_ORD_CS]: '测试员'
    }
    return roleText[flag]
  }

  return { judgmentAuth, judgmentRole }
}
