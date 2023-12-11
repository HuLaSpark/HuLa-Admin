interface HTMLElementWithDragAttribute extends HTMLElement {
  initX: number
  initY: number
  dragged: boolean
}

/**
 * 拖拽函数
 * @param {HTMLElementWithDragAttribute} el - 需要进行拖拽的元素
 */
const drag = (el: HTMLElementWithDragAttribute) => {
  const oDiv = el // 当前元素
  const minTop = oDiv.getAttribute('drag-min-top') // 拖拽时上边界的最小值
  const minRight = oDiv.getAttribute('drag-min-right') // 拖拽时右边界的最小值
  const minBottom = oDiv.getAttribute('drag-min-bottom') // 拖拽时下边界的最小值
  const minLeft = oDiv.getAttribute('drag-min-left') // 拖拽时左边界的最小值
  const ifMoveSizeArea = 20 // 移动大小区域的阈值

  /**
   * 鼠标按下事件
   */
  oDiv.onmousedown = (e: MouseEvent) => {
    let target: HTMLElementWithDragAttribute = oDiv
    while (window.getComputedStyle(target).position !== 'absolute' && target !== document.body) {
      target = target.parentElement as HTMLElementWithDragAttribute
    }

    document.onselectstart = function () {
      return false
    }
    if (!target.getAttribute('init_x')) {
      target.initX = target.offsetLeft
      target.initY = target.offsetTop
    }

    const initX = parseInt(String(target.initX)) // 初始位置的x坐标
    const initY = parseInt(String(target.initY)) // 初始位置的y坐标
    // 鼠标按下，计算当前元素距离可视区的距离
    const disX = e.clientX - target.offsetLeft // 鼠标距离元素左边界的距离
    const disY = e.clientY - target.offsetTop // 鼠标距离元素上边界的距离
    const winWidth = window.innerWidth // 可视区的宽度
    const winHeight = window.innerHeight // 可视区的高度
    const targetWidth = target.offsetWidth // 元素的宽度
    const targetHeight = target.offsetHeight // 元素的高度

    /**
     * 鼠标移动事件
     */
    document.onmousemove = (e: MouseEvent) => {
      // 计算移动的距离
      let l = e.clientX - disX // 鼠标距离元素左边界的移动距离
      let t = e.clientY - disY // 鼠标距离元素上边界的移动距离
      // 检查是否超过约定的边界
      l = Math.max(Number(minLeft), Math.min(l, winWidth - targetWidth - Number(minRight))) // 限制左边界的移动范围
      t = Math.max(Number(minTop), Math.min(t, winHeight - targetHeight - Number(minBottom))) // 限制上边界的移动范围
      // 对该元素的left和top值进行赋值
      target.style.left = `${l}px`
      target.style.top = `${t}px`
      target.dragged = Math.abs(l - initX) > ifMoveSizeArea || Math.abs(t - initY) > ifMoveSizeArea
    }

    /**
     * 鼠标松开事件
     */
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      document.onselectstart = null
    }
    return false
  }
}

export default drag
