<template>
  <div ref="terminalContainer" style="height: 300px; padding: 10px"></div>
</template>

<script setup lang="ts">
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

const terminal = new Terminal({
  letterSpacing: 3,
  convertEol: true, //启用时，光标将设置为下一行的开头
  scrollback: 5, //终端中的回滚量
  disableStdin: false, //是否应禁用输入。
  cursorStyle: 'bar', //光标样式
  cursorWidth: 3, // cursorStyle='bar' 时光标的宽度（以px为单位）
  cursorBlink: true, //光标闪烁
  theme: {
    foreground: '#00b96b', //字体
    background: '#000000', //背景色
    cursor: 'help' //设置光标
  }
})
const fitAddon = new FitAddon()
const terminalContainer = ref()

onMounted(() => {
  setTimeout(() => {
    terminal.loadAddon(fitAddon)
    terminal.open(terminalContainer.value)
    terminal.write('$Vue3+Ts:')
    fitAddon.fit()
  }, 1000)
  terminal.onData((e) => {
    terminal.write(e)
  })
})

terminal.onKey((e) => {
  console.log('键盘按键的值', e.key)
  console.log('键盘事件', e.domEvent)
  if (e.domEvent.keyCode === 13) {
    // 监听回车键
    terminal.write('\r\n') // 回车换行
    terminal.write('$Vue3+Ts:')
  } else if (e.domEvent.keyCode === 8) {
    // 监听backspace键
    if (terminal.buffer.active.cursorX > 9) {
      // 判断如果删除到$Vue3+Ts:就不给删除
      terminal.write('\b \b') // 删除光标前一个字符
    }
  }
})
terminal.onCursorMove(() => {
  console.log('输入光标位置变动')
})
terminal.onLineFeed(() => {
  console.log('操作回车按钮换行')
})
terminal.onSelectionChange(() => {
  console.log('操作鼠标左键选中/取消选中')
})
terminal.onRender((e) => {
  console.log('鼠标移出点击，移入点击以及输入模式下键盘按下', e.start, e.end)
})
terminal.onResize((e) => {
  console.log('resize 设置行列', e.cols, e.rows)
})
</script>
<style scoped>
:deep(.xterm .xterm-viewport) {
  overflow-y: hidden;
  border-radius: 10px;
}
</style>
