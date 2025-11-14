<template>
  <div class="weekData" id="weekData-third">
    <span>总车辆情况</span>
    <div style="display: flex">
      <div class="count-div">
        <p>￥</p>
        <count-to class="count_third" :startVal="0" :endVal="12423" :decimals="1" :duration="2000"></count-to>
      </div>

      <div id="Cardchart-third"></div>
    </div>

    <div class="footer">
      <span class="footer-left">上周新增34%</span>
      <span class="footer-top">
        <CaretUp class="icon" />
        <count-to :startVal="0" :endVal="4424.4" :decimals="1" :duration="2000" />
      </span>

      <span class="footer-bottom">
        <CaretDown class="icon" />
        <count-to :startVal="0" :endVal="824.4" :decimals="1" :duration="2000" />
      </span>
      <div class="tag">
        <n-tag type="error" :bordered="false" size="small" style="float: right"
          ><ArrowNarrowUp class="tag-icon" />33.25%</n-tag
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
const xAxisData: string[] = []
const data1: number[] = []
const data2: number[] = []
for (let i = 0; i < 100; i++) {
  xAxisData.push('A' + i)
  data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
  data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5)
}
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
    const chartDom = document.getElementById('Cardchart-third')!
    chartDom.style.width = '180px'
    chartDom.style.height = '70px'
    myChart = echarts.init(chartDom)
    let option: EChartsOption

    option = {
      title: {
        text: 'Bar Animation Delay',
        show: false
      },
      legend: {
        data: ['bar', 'bar2'],
        show: false
      },
      toolbox: {
        // y: 'bottom',
        show: false,
        feature: {
          magicType: {
            type: ['stack']
          },
          dataView: {},
          saveAsImage: {
            pixelRatio: 2
          }
        }
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        show: false
      },
      yAxis: {
        show: false
      },
      series: [
        {
          name: 'bar',
          type: 'bar',
          data: data1,
          /*使其堆叠*/
          stack: 'Total',
          color: '#bc3f4a',
          emphasis: {
            focus: 'series'
          },
          animationDelay: function (idx) {
            return idx * 10
          }
        },
        {
          name: 'bar2',
          type: 'bar',
          data: data2,
          stack: 'Total',
          color: '#2c964b',
          emphasis: {
            focus: 'series'
          },
          animationDelay: function (idx) {
            return idx * 10 + 100
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
        return idx * 5
      }
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
    .count_third {
      font-weight: bold;
      font-size: 25px;
      color: v-bind(TEXT_COLOR);
    }
  }
  .tag {
    flex: 1;
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
  p {
    color: v-bind(TEXT_COLOR);
  }
}
#Cardchart-third {
  margin-left: 40px;
}
#weekData-third {
  margin-left: 30px;
}
</style>
