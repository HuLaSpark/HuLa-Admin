<template>
  <div class="pie_div">
    <div id="pie">
      <p class="p1">收入统计</p>
      <p style="margin-top: 40px; color: #afabab; font-size: 14px">今日收入</p>
      <div class="amount">
        <p>￥</p>
        <count-to style="font-weight: bold" :startVal="0" :endVal="148.3" :decimals="2" :duration="2000" />
      </div>
      <div style="color: #bc3f4a; font-weight: bold">
        <TrendingUp class="trendCharts" />
        <count-to
          style="font-weight: bold; margin: 0 3px"
          :startVal="0"
          :endVal="14.3"
          :decimals="2"
          :duration="2000" />%
      </div>

      <div id="Piechart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CountTo } from 'vue3-count-to'
import { onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { storeToRefs } from 'pinia'
import { mainStore } from '@/stores/main'
import { TrendingUp } from '@vicons/tabler'

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
    },
    series: [
      {
        itemStyle: {
          color: null
        }
      }
    ]
  })
  /*重新调整图表样式*/
  myChart.resize()
})
onMounted(() => {
  setTimeout(() => {
    // 绘制图表
    const data = [
      { value: 148, name: '今日情况' },
      { value: 335, name: '本周情况' },
      { value: 610, name: '本月情况' }
    ]
    const chartDom = document.getElementById('Piechart')!
    function setChartHeight() {
      chartDom.style.width = '440px'
      chartDom.style.height = window.innerHeight - chartDom.getBoundingClientRect().top - 61 + 'px'
      // 如果页面大小变化时重新调整图表大小
      if (myChart) {
        myChart.resize()
      }
    }
    setChartHeight()
    window.addEventListener('resize', setChartHeight)
    myChart = echarts.init(chartDom)
    let option: EChartsOption

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        left: 'right',
        orient: 'vertical',
        textStyle: {
          color: TEXT_COLOR.value
        }
      },
      backgroundColor: BGC.value,
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center',
            fontSize: 20,
            fontWeight: 'bold'
          },
          data: data
        }
      ]
    }
    option && myChart.setOption(option)
    if (window.matchMedia('(max-width: 1366px)').matches) {
      chartDom.style.width = '250px'
      myChart.resize()
    }
  }, 10)
})
</script>
<style scoped>
#pie .p1 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  background-color: v-bind(BGC);
  color: v-bind(TEXT_COLOR);
}
.pie_div {
  width: 100%;
  height: 100%;
  background: v-bind(BGC);
  padding: 15px;
  border-radius: 10px;
  margin: 0 10px 0 10px;
}
.amount {
  display: flex;
  font-size: 26px;
  margin: 15px 0;
  height: 35px;
  align-items: center;
  color: v-bind(TEXT_COLOR);
}
.amount p {
  font-weight: bold;
}
.trendCharts {
  width: 1em;
  height: 1em;
  vertical-align: -0.2em;
  font-size: 20px;
}
</style>
