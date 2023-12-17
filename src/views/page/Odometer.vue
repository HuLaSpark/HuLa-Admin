<template>
  <div style="display: flex">
    <div>
      <div v-if="defer(4)" style="display: flex">
        <!--顶部卡片-->
        <Cardchart />
        <CardchartSecond />
        <CardchartThird />
      </div>
      <!--折线图组件-->
      <Areachart v-if="defer(8)" />
      <!--柱状图组件-->
      <div v-if="defer(12)" style="display: flex; justify-content: space-between">
        <Barchart />
        <Barchart2 />
        <Barchart3 />
      </div>
    </div>
    <!--饼图组件-->
    <Piechart v-if="defer(16)" />
  </div>
</template>
<script setup lang="ts">
import {
  Areachart,
  Piechart,
  Barchart,
  Barchart2,
  Barchart3,
  Cardchart,
  CardchartSecond,
  CardchartThird
} from '@/views/pagination/odometer/index'
import { useDefer } from '@/hooks/useDefer'

const defer = useDefer(16)
window.$message = useMessage()
window.$notification = useNotification()
</script>
