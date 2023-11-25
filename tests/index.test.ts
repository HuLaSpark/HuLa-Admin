import { createPinia, setActivePinia } from 'pinia'
import { RegExp } from '@/utils/RegExp'
import { useAuth } from '@/hooks/useAuth'
import { expect } from 'vitest'

describe('测试组件', () => {
  /*初始化pinia*/
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  test('测试用户的权限身份来对应tag的类型', () => {
    const { judgmentAuth } = useAuth()
    const flag = judgmentAuth('hl_root')
    expect(flag).toBe('error')
  })

  test('测试用户输入格式是否符合标准', () => {
    /*判断邮箱格式*/
    const email = RegExp.isEmail('123@123.com')
    /*判断密码的复杂度*/
    const paw = RegExp.isPasswordComplex('Kk.123456')
    /*判断输入的内容是否只包含数字和英文*/
    const engOrNub = RegExp.isEngORNub('婚纱店静安寺')
    expect(email).toBe(true)
    expect(paw).toBe(true)
    expect(engOrNub).toBe(false)
  })
})
