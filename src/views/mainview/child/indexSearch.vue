<script setup lang="ts">
import { ref } from "vue"
// 搜索栏数据
const input = ref("");
// 搜索栏点击
const inputClick = ()=>{
    console.log(2);
    
}

</script>
<template>
    <el-input v-model="input" placeholder="寻找功能"  @click.stop />
</template>
<style scoped></style>