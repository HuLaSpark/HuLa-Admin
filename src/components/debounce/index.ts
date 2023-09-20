let timer: any | null = null

/**
 * @explain 防抖函数(用于输入框，解决高频输入然后发送请求问题)
 * @param fn 方法或参数
 * @param delay 延迟时间
 * @param firstClick 是否第一次需要执行
 */
const debounce = (fn: any, delay: number, firstClick: boolean) => {
  if (firstClick) {
    // 第一次会执行
    fn()
  }
  // 如果定时器存在清空定时器
  if (timer) {
    clearTimeout(timer)
  }
  // 设置定时器，此时firstClick会变为false，规定时间后time才会为null
  timer = setTimeout(() => {
    timer = null
    // 如果firstClick为true，执行
    if (!firstClick) {
      //  fn(...arguments);
      fn()
    }
  }, delay)
}

/*销毁定时器*/
const clear = () => {
  clearTimeout(timer)
  timer = null
}

export { debounce, clear }
