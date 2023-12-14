import { pkgJson } from '@/common/model.ts'

export class Common {
  /**
   * 去除两边空格
   * @param value 待处理字符串
   */
  public static noSideSpace(value: string): boolean {
    return !value.startsWith(' ') && !value.endsWith(' ')
  }

  /**
   * 控制台打印版本信息
   */
  public static consolePrint() {
    console.log(
      `%c 🥝 HuLa-vue3 ${pkgJson.version}`,
      'font-size:20px;border-left: 4px solid #189f57;background: #e5f3ec;font-family: Comic Sans MS, cursive;color:#581845;padding:10px;border-radius:4px;',
      'https://gitee.com/nongyehong'
    )
  }
}
