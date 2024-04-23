
<script setup lang="ts">
</script>
<template>
    <div class="collapse-item">
        <slot name="title">列表</slot>
        <el-icon><ArrowRight /></el-icon>
    </div>
</template>

<style scoped>
.collapse-item{
    display:flex;
    align-items: center;
    justify-content: space-between;
    padding:.5vh 0;
    border-bottom:.5px solid #3300ff;
}

</style>