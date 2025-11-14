<template>
  <div class="weekData">
    <span>最近7天的数据</span>
    <div style="display: flex">
      <div class="count-div">
        <p>￥</p>
        <count-to class="count" :startVal="0" :endVal="244" :decimals="2" :duration="2000"></count-to>
      </div>

      <div id="Cardchart"></div>
    </div>

    <div class="footer">
      <span class="footer-left">上周新增10%</span>
      <span class="footer-top">
        <CaretUp class="icon" />
        <count-to :startVal="0" :endVal="24.4" :decimals="2" :duration="2000" />
      </span>

      <span class="footer-bottom">
        <CaretDown class="icon" />
        <count-to :startVal="0" :endVal="4.4" :decimals="2" :duration="2000" />
      </span>
      <div class="tag">
        <n-tag type="error" :bordered="false" size="small" style="float: right"
          ><ArrowNarrowUp class="tag-icon" />14.5%</n-tag
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CountTo } from 'vue3-count-to'
import * as echarts from 'echarts'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { ArrowNarrowUp, CaretDown, CaretUp } from '@vicons/tabler'

type EChartsOption = echarts.EChartsOption
const store = mainStore()
const { TEXT_COLOR, EYE_THEME, BGC } = storeToRefs(store)
let myChart: echarts.ECharts

watch(EYE_THEME, () => {
  /*监听主题是否切换，如果切换就重新绘制图表*/
  myChart.setOption({
    backgroundColor: BGC.value,
    legend: {
      textStyle: {
        color: TEXT_COLOR.value
      }
    }
  })
})
onMounted(() => {
  setTimeout(() => {
    // 绘制图表
    const chartDom = document.getElementById('Cardchart')!
    /*在绘制图表前需要给定宽度和高度，否则控制台就会报警报*/
    chartDom.style.width = '180px'
    chartDom.style.height = '70px'
    myChart = echarts.init(chartDom)
    let option: EChartsOption

    option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      tooltip: {
        trigger: 'axis'
      },
      series: [
        {
          data: [12, 32, 77, 63, 129, 45, 8],
          type: 'line',
          smooth: true
        }
      ]
    }
    option && myChart.setOption(option)
    if (window.matchMedia('(max-width: 1366px)').matches) {
      chartDom.style.transform = 'scale(0.7)'
      myChart.resize()
    }
  }, 10)
})
</script>

<style lang="scss" scoped>
@use '@/styles/scss/cardchart.scss';
.weekData {
  background: v-bind(BGC);
  span {
    color: v-bind(TEXT_COLOR);
  }
  .count-div {
    display: flex;
    height: 70px;
    align-items: center;
    .count {
      font-weight: bold;
      font-size: 25px;
      color: v-bind(TEXT_COLOR);
    }
  }
  .footer {
    display: flex;
    margin-top: 40px;
    font-size: 14px;
    .footer-left {
      color: #cccccc;
    }
    .footer-top {
      color: #bc3f4a;
      font-weight: bold;
      margin-left: 5px;
    }
    .footer-bottom {
      color: #2c964b;
      font-weight: bold;
      margin-left: 5px;
    }
  }
  .tag {
    flex: 1;
  }
  p {
    color: v-bind(TEXT_COLOR);
  }
}
#Cardchart {
  margin-left: 40px;
}
</style>
