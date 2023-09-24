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
      hl_sys_admin: FlagEnum.HL_SYS_ADMIN,
      hl_sys_manage: FlagEnum.HL_SYS_MANAGE,
      hl_sys_user: FlagEnum.HL_SYS_USER
    }
    return authMap[flag] || 'info'
  }
  const judgmentRole = (flag: keyof RoleText) => {
    const roleText: RoleText = {
      [RoleEnum.HL_SYS_ADMIN]: '超级管理员',
      [RoleEnum.HL_SYS_MANAGE]: '管理员',
      [RoleEnum.HL_SYS_USER]: '普通用户'
    }
    return roleText[flag]
  }

  return { judgmentAuth, judgmentRole }
}
