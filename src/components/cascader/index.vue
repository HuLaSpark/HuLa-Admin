<template>
  <!--    <el-cascader filterable v-model="value" :options="options" @change="handleChange" />-->
  <el-cascader filterable :options="options" @change="handleChange">
    <template #default="{ node, data }">
      <span>{{ data.label }}</span>
      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
    </template>
  </el-cascader>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref([])

const emit = defineEmits(['options'])

const handleChange = (value: any) => {
  emit('options', value)
}

const options = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '东城区',
        label: '东城区'
      },
      {
        value: '朝阳区',
        label: '朝阳区'
      },
      {
        value: '海淀区',
        label: '海淀区'
      }
    ]
  },
  {
    value: '天津市',
    label: '天津市',
    children: [
      {
        value: '和平区',
        label: '和平区'
      },
      {
        value: '河东区',
        label: '河东区'
      },
      {
        value: '南开区',
        label: '南开区'
      }
    ]
  },
  {
    value: '河北省',
    label: '河北省',
    children: [
      {
        value: '石家庄市',
        label: '石家庄市'
      },
      {
        value: '唐山市',
        label: '唐山市'
      },
      {
        value: '邯郸市',
        label: '邯郸市'
      }
    ]
  },
  {
    value: '山西省',
    label: '山西省',
    children: [
      {
        value: '太原市',
        label: '太原市'
      },
      {
        value: '大同市',
        label: '大同市'
      },
      {
        value: '运城市',
        label: '运城市'
      }
    ]
  },
  {
    value: '内蒙古自治区',
    label: '内蒙古自治区',
    children: [
      {
        value: '呼和浩特市',
        label: '呼和浩特市'
      },
      {
        value: '包头市',
        label: '包头市'
      },
      {
        value: '赤峰市',
        label: '赤峰市'
      }
    ]
  },
  {
    value: '辽宁省',
    label: '辽宁省',
    children: [
      {
        value: '沈阳市',
        label: '沈阳市'
      },
      {
        value: '大连市',
        label: '大连市'
      },
      {
        value: '鞍山市',
        label: '鞍山市'
      }
    ]
  },
  {
    value: '吉林省',
    label: '吉林省',
    children: [
      {
        value: '长春市',
        label: '长春市'
      },
      {
        value: '吉林市',
        label: '吉林市'
      },
      {
        value: '延边朝鲜族自治州',
        label: '延边朝鲜族自治州'
      }
    ]
  },
  {
    value: '黑龙江省',
    label: '黑龙江省',
    children: [
      {
        value: '哈尔滨市',
        label: '哈尔滨市'
      },
      {
        value: '齐齐哈尔市',
        label: '齐齐哈尔市'
      },
      {
        value: '大庆市',
        label: '大庆市'
      }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '黄浦区',
        label: '黄浦区'
      },
      {
        value: '徐汇区',
        label: '徐汇区'
      },
      {
        value: '静安区',
        label: '静安区'
      }
    ]
  },
  {
    value: '江苏省',
    label: '江苏省',
    children: [
      {
        value: '南京市',
        label: '南京市'
      },
      {
        value: '苏州市',
        label: '苏州市'
      },
      {
        value: '无锡市',
        label: '无锡市'
      }
    ]
  },
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '杭州市',
        label: '杭州市'
      },
      {
        value: '宁波市',
        label: '宁波市'
      },
      {
        value: '温州市',
        label: '温州市'
      }
    ]
  },
  {
    value: '安徽省',
    label: '安徽省',
    children: [
      {
        value: '合肥市',
        label: '合肥市'
      },
      {
        value: '芜湖市',
        label: '芜湖市'
      },
      {
        value: '马鞍山市',
        label: '马鞍山市'
      }
    ]
  },
  {
    value: '福建省',
    label: '福建省',
    children: [
      {
        value: '福州市',
        label: '福州市'
      },
      {
        value: '厦门市',
        label: '厦门市'
      },
      {
        value: '泉州市',
        label: '泉州市'
      }
    ]
  },
  {
    value: '江西省',
    label: '江西省',
    children: [
      {
        value: '南昌市',
        label: '南昌市'
      },
      {
        value: '九江市',
        label: '九江市'
      },
      {
        value: '赣州市',
        label: '赣州市'
      }
    ]
  },
  {
    value: '山东省',
    label: '山东省',
    children: [
      {
        value: '济南市',
        label: '济南市'
      },
      {
        value: '青岛市',
        label: '青岛市'
      },
      {
        value: '烟台市',
        label: '烟台市'
      }
    ]
  },
  {
    value: '河南省',
    label: '河南省',
    children: [
      {
        value: '郑州市',
        label: '郑州市'
      },
      {
        value: '洛阳市',
        label: '洛阳市'
      },
      {
        value: '南阳市',
        label: '南阳市'
      }
    ]
  },
  {
    value: '湖北省',
    label: '湖北省',
    children: [
      {
        value: '武汉市',
        label: '武汉市'
      },
      {
        value: '黄石市',
        label: '黄石市'
      },
      {
        value: '宜昌市',
        label: '宜昌市'
      }
    ]
  },
  {
    value: '湖南省',
    label: '湖南省',
    children: [
      {
        value: '长沙市',
        label: '长沙市'
      },
      {
        value: '株洲市',
        label: '株洲市'
      },
      {
        value: '湘潭市',
        label: '湘潭市'
      }
    ]
  },
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '广州市',
        label: '广州市'
      },
      {
        value: '深圳市',
        label: '深圳市'
      },
      {
        value: '珠海市',
        label: '珠海市'
      }
    ]
  },
  {
    value: '广西壮族自治区',
    label: '广西壮族自治区',
    children: [
      {
        value: '南宁市',
        label: '南宁市'
      },
      {
        value: '柳州市',
        label: '柳州市'
      },
      {
        value: '桂林市',
        label: '桂林市'
      }
    ]
  },
  {
    value: '海南省',
    label: '海南省',
    children: [
      {
        value: '海口市',
        label: '海口市'
      },
      {
        value: '三亚市',
        label: '三亚市'
      },
      {
        value: '琼海市',
        label: '琼海市'
      }
    ]
  },
  {
    value: '四川省',
    label: '四川省',
    children: [
      {
        value: '成都市',
        label: '成都市'
      },
      {
        value: '绵阳市',
        label: '绵阳市'
      },
      {
        value: '德阳市',
        label: '德阳市'
      }
    ]
  },
  {
    value: '贵州省',
    label: '贵州省',
    children: [
      {
        value: '贵阳市',
        label: '贵阳市'
      },
      {
        value: '遵义市',
        label: '遵义市'
      },
      {
        value: '安顺市',
        label: '安顺市'
      }
    ]
  },
  {
    value: '云南省',
    label: '云南省',
    children: [
      {
        value: '昆明市',
        label: '昆明市'
      },
      {
        value: '曲靖市',
        label: '曲靖市'
      },
      {
        value: '大理市',
        label: '大理市'
      }
    ]
  },
  {
    value: '西藏自治区',
    label: '西藏自治区',
    children: [
      {
        value: '拉萨市',
        label: '拉萨市'
      },
      {
        value: '昌都市',
        label: '昌都市'
      },
      {
        value: '林芝市',
        label: '林芝市'
      }
    ]
  },
  {
    value: '陕西省',
    label: '陕西省',
    children: [
      {
        value: '西安市',
        label: '西安市'
      },
      {
        value: '宝鸡市',
        label: '宝鸡市'
      },
      {
        value: '咸阳市',
        label: '咸阳市'
      }
    ]
  },
  {
    value: '甘肃省',
    label: '甘肃省',
    children: [
      {
        value: '兰州市',
        label: '兰州市'
      },
      {
        value: '天水市',
        label: '天水市'
      },
      {
        value: '白银市',
        label: '白银市'
      }
    ]
  },
  {
    value: '青海省',
    label: '青海省',
    children: [
      {
        value: '西宁市',
        label: '西宁市'
      },
      {
        value: '海东市',
        label: '海东市'
      },
      {
        value: '格尔木市',
        label: '格尔木市'
      }
    ]
  },
  {
    value: '宁夏回族自治区',
    label: '宁夏回族自治区',
    children: [
      {
        value: '银川市',
        label: '银川市'
      },
      {
        value: '石嘴山市',
        label: '石嘴山市'
      },
      {
        value: '吴忠市',
        label: '吴忠市'
      }
    ]
  },
  {
    value: '新疆维吾尔自治区',
    label: '新疆维吾尔自治区',
    children: [
      {
        value: '乌鲁木齐市',
        label: '乌鲁木齐市'
      },
      {
        value: '克拉玛依市',
        label: '克拉玛依市'
      },
      {
        value: '吐鲁番市',
        label: '吐鲁番市'
      }
    ]
  },
  {
    value: '台湾省',
    label: '台湾省',
    children: [
      {
        value: '台北市',
        label: '台北市'
      },
      {
        value: '新北市',
        label: '新北市'
      },
      {
        value: '桃园市',
        label: '桃园市'
      }
    ]
  },
  {
    value: '香港特别行政区',
    label: '香港特别行政区',
    children: [
      {
        value: '中西区',
        label: '中西区'
      },
      {
        value: '湾仔区',
        label: '湾仔区'
      },
      {
        value: '东区',
        label: '东区'
      }
    ]
  },
  {
    value: '澳门特别行政区',
    label: '澳门特别行政区',
    children: [
      {
        value: '澳门半岛',
        label: '澳门半岛'
      },
      {
        value: '氹仔岛',
        label: '氹仔岛'
      },
      {
        value: '路环岛',
        label: '路环岛'
      }
    ]
  }
]
</script>
<style>
.el-cascader-node.in-active-path,
.el-cascader-node.is-active,
.el-cascader-node.is-selectable.in-checked-path {
  color: #189f58;
}
</style>
