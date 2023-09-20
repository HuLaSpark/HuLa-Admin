import { FlagEnum } from '@/enums'

type AuthMap = {
  [key: string]: FlagEnum
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
  return { judgmentAuth }
}
