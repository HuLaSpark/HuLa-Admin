<template>
  <div class="code-input">
    <!-- 循环生成指定数量的输入框 -->
    <div v-for="(_, index) in codeLength" :key="index">
      <!-- 输入框 -->
      <input
        ref="inputRefs"
        type="text"
        maxlength="1"
        :value="code[index]"
        @input="onInput(($event.target as any).value, index)"
        @keydown="onKeyDown($event, index)"
        :style="{ width: inputSize + 'px', height: inputSize + 'px' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores/main'

const store = mainStore()
const { BGC_OTHER } = storeToRefs(store)
const { codeLength, inputSize } = defineProps({
  // 验证码长度
  codeLength: { type: Number, default: 0 },
  // 输入框大小
  inputSize: { type: Number, default: 0 }
})

const code = ref<Array<string>>(Array(codeLength).fill('')) // 验证码数组
const inputRefs = ref<Array<HTMLInputElement | null>>([]) // 输入框引用数组
const focusedIndex = ref<number>(0) // 当前聚焦的输入框索引

// 当输入框的值发生变化时，执行以下函数
const onInput = async (value: string, index: number) => {
  // 只接受单个数字
  value = value.slice(-1)
  if (/\d/.test(value)) {
    // 如果输入的是数字
    code.value[index] = value // 将输入框的值设为输入的数字
    // 输入时自动聚焦下一个输入框
    if (index < codeLength - 1) {
      // 如果当前输入框不是最后一个
      inputRefs.value[index + 1]?.focus() // 将焦点聚焦到下一个输入框
    } else {
      // 当最后一个输入框输入完毕后执行方法
      await handlePawReset()
    }
  } else {
    // 如果输入的不是数字
    code.value[index] = '' // 将当前输入框的值设为空
  }
  focusedIndex.value = index // 将当前聚焦的输入框索引设为当前输入框的索引
}

// 当按下键盘上的退格键时，执行以下函数
const onKeyDown = (event: KeyboardEvent, index: number) => {
  if (event.code === 'Backspace') {
    // 如果按下的是退格键
    event.preventDefault() // 阻止默认的退格事件
    code.value[index] = '' // 将当前输入框的值设为空
    // 按下退格键时自动聚焦上一个输入框
    if (index > 0) {
      // 如果当前输入框不是第一个
      inputRefs.value[index - 1]?.focus() // 将焦点聚焦到上一个输入框
    }
    focusedIndex.value = index - 1 // 将当前聚焦的输入框索引设为上一个输入框的索引
  }
}

// 监听粘贴事件
const onPaste = (event: ClipboardEvent) => {
  event.preventDefault() // 阻止默认粘贴事件
  const clipboardData = event.clipboardData // 获取剪贴板数据
  if (clipboardData) {
    const pastedText = clipboardData.getData('text') // 获取剪贴板中的文本
    const pastedChars = pastedText.split('') // 将文本转换为字符数组
    let currentIndex = focusedIndex.value // 获取当前聚焦的输入框索引
    let i = 0
    // 如果当前聚焦的是第一个输入框，则将第一个粘贴的字符放入第一个输入框中
    if (currentIndex === 0) {
      code.value[currentIndex] = pastedChars[i] // 将第一个字符放入第一个输入框中
      inputRefs.value[currentIndex]?.focus() // 聚焦第一个输入框
      currentIndex++ // 将当前索引指向下一个输入框
      i++ // 将字符数组的索引指向下一个字符
    }
    // 将剩余的粘贴字符放入后续的输入框中
    for (; i < pastedChars.length && currentIndex < codeLength; i++) {
      const char = pastedChars[i]
      if (/\d/.test(char)) {
        // 如果是数字
        code.value[currentIndex] = char // 将字符放入当前输入框中
        inputRefs.value[currentIndex]?.focus() // 聚焦当前输入框
        currentIndex++ // 将当前索引指向下一个输入框
      }
    }
    // 粘贴输入完毕后执行
    if (currentIndex === codeLength) {
      handlePawReset()
    }
  }
}

/*重置密码方法*/
const handlePawReset = async () => {

}

onMounted(() => {
  // 页面加载时自动聚焦第一个输入框
  inputRefs.value[0]?.focus()
  // 监听粘贴事件
  document.addEventListener('paste', onPaste)
})

onUnmounted(() => {
  // 页面卸载时移除粘贴事件监听
  document.removeEventListener('paste', onPaste)
})
</script>

<style scoped>
.code-input {
  display: flex;
  justify-content: space-between;
  width: 50px;
  margin: 30px 0;
}

.code-input input {
  font-size: 24px;
  text-align: center;
  border: none;
  border-radius: 15px;
  background-color: v-bind(BGC_OTHER);
  margin-right: 5px;
  outline-color: #189f58; /* 设置选中时的外边框颜色 */
  color: #2c964b;
}

.code-input input:focus {
  outline-color: #189f58; /* 设置选中时的外边框颜色 */
  caret-color: #189f58; /* 设置光标颜色 */
}
</style>
