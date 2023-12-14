/*处理取消模态框关闭*/
import { animation } from '@/components/modal/type.ts'
import { nextTick } from 'vue'
import typeState from '@/hooks/useState.ts'

/*解构状态类型参数*/
const { showModal } = typeState
const cancel = async () => {
  /*取消后的动画*/
  animation.value = 'modal-container animate__animated animate__fadeOutDownBig'
  /*等待动画结束后才执行关闭模态框*/
  await nextTick(() => {
    showModal.value = false
    /*重新初始化动画*/
    animation.value = 'modal-container animate__animated animate__shakeX'
  })
}
/*处理关闭模态框,关闭的时候初始化表单中的数据*/
const close = async () => {
  animation.value = 'modal-container animate__animated animate__fadeOutLeftBig'
  await nextTick(() => {
    showModal.value = false
    animation.value = 'modal-container animate__animated animate__shakeX'
  })
}

export default () => ({
  cancel,
  close
})
