<template>
  <div class="footer">Copyright © 2023-2026 HuLa.All Rights Reserved.</div>
</template>

<script setup lang="ts">
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

const store = mainStore()
const { BGC_OTHER } = storeToRefs(store)
</script>

<style scoped>
.footer {
  height: 30px;
  line-height: 30px;
  border-top: 1px solid v-bind(BGC_OTHER);
  background-color: #4b4a4a;
  color: #cccccc;
  text-align: center;
  font-size: 14px;
}
</style>
