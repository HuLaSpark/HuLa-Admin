import { pkgJson } from '@/common/model.ts'

export const consolePrinter = () => {
  console.log(
    `%c 🥝 HuLa-vue3 ${pkgJson.version}`,
    'font-size:20px;border-left: 4px solid #189f57;background: #e5f3ec;font-family: Comic Sans MS, cursive;color:#581845;padding:10px;border-radius:4px;',
    'https://gitee.com/nongyehong'
  )
}
