<template>
  <div class="weekData" id="weekData-second">
    <span>最近30天的数据</span>
    <div style="display: flex">
      <div class="count-div">
        <p>￥</p>
        <count-to class="count_second" :startVal="0" :endVal="5443" :decimals="2" :duration="2000" />
      </div>
      <!--图表-->
      <div id="Cardchart-second"></div>
    </div>

    <div class="footer">
      <span class="footer-left">上月新增11%</span>
      <span class="footer-top">
        <CaretUp class="icon" />
        <count-to :startVal="0" :endVal="243.2" :decimals="2" :duration="2000" />
      </span>

      <span class="footer-bottom">
        <CaretDown class="icon" />
        <count-to :startVal="0" :endVal="124.4" :decimals="2" :duration="2000" />
      </span>
      <div class="tag">
        <n-tag type="error" :bordered="false" size="small" style="float: right"
          ><ArrowNarrowUp class="tag-icon" />12.1%</n-tag
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CountTo } from 'vue3-count-to'
import { onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { ArrowNarrowUp, CaretDown, CaretUp } from '@vicons/tabler'

type EChartsOption = echarts.EChartsOption
const data = [
  ['2000-06-05', 116],
  ['2000-06-06', 129],
  ['2000-06-07', 135],
  ['2000-06-08', 86],
  ['2000-06-09', 73],
  ['2000-06-10', 85],
  ['2000-06-11', 173],
  ['2000-06-12', 68],
  ['2000-06-13', 92],
  ['2000-06-14', 130],
  ['2000-06-15', 245],
  ['2000-06-16', 139],
  ['2000-06-17', 115],
  ['2000-06-18', 111],
  ['2000-06-19', 309],
  ['2000-06-20', 206],
  ['2000-06-21', 137],
  ['2000-06-22', 128],
  ['2000-06-23', 85],
  ['2000-06-24', 94],
  ['2000-06-25', 71],
  ['2000-06-26', 106],
  ['2000-06-27', 84],
  ['2000-06-28', 93],
  ['2000-06-29', 85],
  ['2000-06-30', 73],
  ['2000-07-01', 83],
  ['2000-07-02', 325],
  ['2000-07-03', 107],
  ['2000-07-04', 82],
  ['2000-07-05', 44]
]
const dateList = data.map(function (item) {
  return item[0]
})
const valueList = data.map(function (item) {
  return item[1]
})
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
    const chartDom = document.getElementById('Cardchart-second')!
    chartDom.style.width = '180px'
    chartDom.style.height = '70px'
    myChart = echarts.init(chartDom)
    let option: EChartsOption

    option = {
      title: [
        {
          left: 'center',
          text: 'Gradient along the y axis',
          show: false
        }
      ],
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [
        {
          data: dateList,
          show: false
        }
      ],
      yAxis: [
        {
          show: false
        }
      ],
      series: [
        {
          type: 'line',
          showSymbol: false,
          data: valueList,
          itemStyle: {
            /*渐变色线条*/
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 1,
                color: '#45c290'
              },
              {
                offset: 0,
                color: '#bc3f4a'
              }
            ])
          }
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
    .count_second {
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
#Cardchart-second {
  margin-left: 40px;
}
#weekData-second {
  margin-left: 30px;
}
</style>
