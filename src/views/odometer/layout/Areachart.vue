<template>
  <div id="Areachart" class="areachart_div"></div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { i18n } from '@/i18n'

type EChartsOption = echarts.EChartsOption
const store = mainStore()
const { TEXT_COLOR, EYE_THEME, BGC } = storeToRefs(store)
const { locale, t } = i18n.global
const titleText = ref(t('current_monthly_situation'))
const audit = ref(t('audit'))
const violation = ref(t('violation'))
let myChart: echarts.ECharts
watch(EYE_THEME, () => {
  /*监听主题是否切换，如果切换就重新绘制图表*/
  myChart.setOption({
    backgroundColor: BGC.value,
    title: {
      textStyle: {
        color: TEXT_COLOR.value
      }
    },
    legend: {
      textStyle: {
        color: TEXT_COLOR.value
      }
    }
  })
  /*重新调整图表样式*/
  myChart.resize()
})
watch(locale, () => {
  titleText.value = t('current_monthly_situation')
  audit.value = t('audit')
  violation.value = t('violation')
  /*监听语言是否切换，如果切换就重新绘制图表*/
  myChart.setOption({
    title: {
      text: titleText.value
    },
    /*标签*/
    legend: {
      data: [audit.value, violation.value]
    },
    series: [{ name: audit.value }, { name: violation.value }]
  })
  /*重新调整图表样式*/
  myChart.resize()
})
onMounted(() => {
  setTimeout(() => {
    // 绘制图表
    const chartDom = document.getElementById('Areachart')!
    function setChartHeight() {
      chartDom.style.height = window.innerHeight - chartDom.getBoundingClientRect().top - 350 + 'px'
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
      /*标题*/
      title: {
        left: 'center',
        text: titleText.value,
        textStyle: {
          color: TEXT_COLOR.value
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      /*提示*/
      tooltip: {
        trigger: 'axis',
        /*十字准星模式*/
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      yAxis: {
        type: 'value'
      },
      /*网格模式*/
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      /*标签*/
      legend: {
        data: [audit.value, violation.value],
        /*居右*/
        left: 'right',
        /*垂直布局*/
        orient: 'vertical',
        textStyle: {
          color: TEXT_COLOR.value
        }
      },
      backgroundColor: BGC.value,
      series: [
        {
          name: audit.value,
          data: [82, 32, 77, 63, 129, 45, 88, 42, 33, 77, 92, 31],
          /*图表类型*/
          type: 'line',
          /*图表上的圆点*/
          symbol: 'none',
          /*线条的样式*/
          itemStyle: {
            color: 'rgb(45,163,78)'
          },
          /*线条下的样式*/
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(49,193,123)'
              },
              {
                offset: 1,
                color: 'rgb(255,255,255)'
              }
            ])
          },
          /*开启堆叠*/
          stack: 'Total',
          /*是否是光滑的还是折线的*/
          smooth: true,
          /*线条的厚度*/
          lineStyle: {
            width: 0.8
          },
          /*选中后单个后其他的隐藏*/
          emphasis: {
            focus: 'series'
          }
        },
        {
          name: violation.value,
          data: [22, 32, 37, 63, 89, 75, 58, 42, 33, 47, 92, 131],
          type: 'line',
          symbol: 'none',
          itemStyle: {
            color: 'rgb(188,63,74)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(203,99,109)'
              },
              {
                offset: 1,
                color: 'rgb(255,255,255)'
              }
            ])
          },
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0.8
          },
          emphasis: {
            focus: 'series'
          }
        }
      ]
    }
    option && myChart.setOption(option)
    if (window.matchMedia('(max-width: 1366px)').matches) {
      chartDom.style.height = window.innerHeight - chartDom.getBoundingClientRect().top - 260 + 'px'
      myChart.resize()
    }
  }, 10)
})
</script>
<style scoped>
.areachart_div {
  background: v-bind(BGC);
  padding: 15px;
  border-radius: 10px;
}
</style>
