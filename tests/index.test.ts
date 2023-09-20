import { createPinia, setActivePinia } from 'pinia'
import { StringUtils } from '@/utils/StringUtils'
import { useAuth } from '@/hooks/useAuth'

describe('测试组件', () => {
  /*初始化pinia*/
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  test('测试用户的权限身份来对应tag的类型', () => {
    const { judgmentAuth } = useAuth()
    const flag = judgmentAuth('sys_admin')
    expect(flag).toBe('error')
  })

  test('测试用户输入格式是否符合标准', () => {
    /*判断邮箱格式*/
    const email = StringUtils.isEmail('123@123.com')
    /*判断密码的复杂度*/
    const paw = StringUtils.isPasswordComplex('Kk.123456')
    expect(email).toBe(true)
    expect(paw).toBe(true)
  })
})
