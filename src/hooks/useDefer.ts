/**
 * defer优化加载
 * @param maxCount 最大帧数
 */
export const useDefer = (maxCount = 10) => {
  // 定义一个帧数值变量
  const frameCount = ref(0)
  // 定义一个可调用的id变量
  let farId: number
  // 定义一个更新帧数的函数
  const updateFrameCount = () => {
    // 调用requestAnimationFrame函数，每次更新帧数值
    farId = requestAnimationFrame(() => {
      // 将帧数值加1
      frameCount.value++
      // 如果帧数值超过最大值，则返回
      if (frameCount.value >= maxCount) {
        return
      }
      // 更新帧数
      updateFrameCount()
    })
  }
  // 更新帧数
  updateFrameCount()
  // 绑定挂载时调用
  onUnmounted(() => {
    // 取消requestAnimationFrame函数
    cancelAnimationFrame(farId)
  })
  // 返回一个函数，参数为一个数字T
  return (T: number) => {
    // 返回帧数值大于等于T的布尔值
    return frameCount.value >= T
  }
}
