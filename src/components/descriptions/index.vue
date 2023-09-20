<template>
  <!--  封装车辆违章详细信息组件  -->
  <el-descriptions :column="2" border v-for="item in filteredViolations(vehicleName)" :key="item.id">
    <el-descriptions-item>
      <template #label
        ><div class="cell-item">{{ t('ownerName') }}</div></template
      >
      <el-tag round type="danger">{{ (item as any).ownerName }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label
        ><div class="cell-item">{{ t('license_plate') }}</div></template
      >
      <el-tag round type="danger">{{ (item as any).licensePlate }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label
        ><div class="cell-item">{{ t('address') }}</div></template
      >
      <el-tag round type="danger">{{ JSON.parse((item as any).address)[0] }}</el-tag>
      <el-tag round type="warning">{{ JSON.parse((item as any).address)[1] }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label
        ><div class="cell-item">{{ t('email') }}</div></template
      >
      <el-tag round type="info">{{ (item as any).email }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label
        ><div class="cell-item">{{ t('brand') }}</div></template
      >
      <el-tag round type="warning">{{ (item as any).brand }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label
        ><div class="cell-item">{{ t('model') }}</div></template
      >
      <el-tag round type="warning">{{ (item as any).model }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label
        ><div class="cell-item">{{ t('engineNumber') }}</div></template
      >
      {{ (item as any).engineNumber }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label
        ><div class="cell-item">{{ t('frameNumber') }}</div></template
      >
      {{ (item as any).frameNumber }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
import useViolations from '@/hooks/useSystem/useViolations'

const { t } = i18n.global
const { violationsInfo } = useViolations()

const props = defineProps({
  vehicleName: { type: String, required: true },
  fn: { type: Function, default: null }
})

/*车辆违章详细信息*/
const filteredViolations = (vehicleName: any) => {
  return violationsInfo.value?.filter((item: any) => item.licensePlate === vehicleName)
}
</script>

<style scoped></style>
