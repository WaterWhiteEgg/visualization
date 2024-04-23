<script setup lang="ts">
import { ref } from "vue"
// 搜索栏数据
const input = ref("");

</script>
<template>
    <el-input v-model="input" placeholder="Please input" />
</template>
<style scoped></style>