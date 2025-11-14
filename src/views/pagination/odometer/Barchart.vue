<template>
  <div id="Barchart" class="barchart"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

type EChartsOption = echarts.EChartsOption
const color = 'rgb(201,196,196)'
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
    title: {
      textStyle: {
        color: TEXT_COLOR.value
      }
    }
  })
})

onMounted(() => {
  setTimeout(() => {
    // 绘制图表
    const chartDom = document.getElementById('Barchart')!
    function setChartHeight() {
      chartDom.style.width = '350px'
      chartDom.style.height = window.innerHeight - chartDom.getBoundingClientRect().top - 72 + 'px'
    }
    setChartHeight()
    window.addEventListener('resize', setChartHeight)
    myChart = echarts.init(chartDom)
    let option: EChartsOption

    option = {
      barWidth: 20,
      title: {
        text: '车辆一周的违规情况',
        textStyle: {
          color: TEXT_COLOR.value
        },
        subtext: 'A week is worth of vehicle violations'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [
            {
              value: 120,
              itemStyle: {
                color: color
              }
            },
            200,
            {
              value: 150,
              itemStyle: {
                color: color
              }
            },
            {
              value: 80,
              itemStyle: {
                color: color
              }
            },
            {
              value: 70,
              itemStyle: {
                color: color
              }
            },
            {
              value: 110,
              itemStyle: {
                color: color
              }
            },
            {
              value: 130,
              itemStyle: {
                color: 'rgb(201,196,196)'
              }
            }
          ],
          type: 'bar'
        }
      ]
    }
    option && myChart.setOption(option)
    if (window.matchMedia('(max-width: 1366px)').matches) {
      chartDom.style.width = '240px'
      chartDom.style.height = window.innerHeight - chartDom.getBoundingClientRect().top - 52 + 'px'
      myChart.resize()
    }
  }, 10)
})
</script>

<style lang="scss" scoped>
@use '@/styles/scss/barchar.scss';

.barchart {
  background: v-bind(BGC);
}
</style>
