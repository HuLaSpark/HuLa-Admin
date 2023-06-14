<template>
    <div id="app">
        <n-message-provider max="6">
            <Login/>
        </n-message-provider>
    </div>
</template>

<script setup lang="ts">
import Login from '@/views/login/index.vue'
</script>

<style scoped>
</style>
