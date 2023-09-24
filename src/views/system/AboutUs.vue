<template>
  <n-space :vertical="true" :size="16">
    <project-info />
    <pro-dependency />
    <dev-dependency />
  </n-space>
</template>

<script setup lang="ts">
import { DevDependency, ProDependency, ProjectInfo } from '@/components/aboutUs/index'
</script>

<style scoped></style>
