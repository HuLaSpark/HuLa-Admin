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
      <div v-if="defer(12)" style="display: flex">
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
import Areachart from '@/views/odometer/layout/Areachart.vue'
import Piechart from '@/views/odometer/layout/Piechart.vue'
import Barchart from '@/views/odometer/layout/Barchart.vue'
import Barchart2 from '@/views/odometer/layout/Barchart-second.vue'
import Barchart3 from '@/views/odometer/layout/Barchart-third.vue'
import Cardchart from '@/views/odometer/layout/Cardchart.vue'
import CardchartSecond from '@/views/odometer/layout/Cardchart-second.vue'
import CardchartThird from '@/views/odometer/layout/Cardchart-third.vue'
import { useDefer } from '@/hooks/useDefer'

const defer = useDefer(16)
window.$message = useMessage()
window.$notification = useNotification()
</script>
