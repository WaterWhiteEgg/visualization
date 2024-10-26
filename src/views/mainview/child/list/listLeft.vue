<script setup lang="ts">
withDefaults(
  defineProps<{
    borderBottom?: string;
  }>(),
  { borderBottom: "0.5px solid #fff" }
);
</script>
<template>
  <div class="collapse-item" :style="{ borderBottom: borderBottom }">
    <slot name="title">列表</slot>
    <el-icon><ArrowRight /></el-icon>
  </div>
</template>

<style scoped>
.collapse-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5vh 0;
  border-bottom: 0.5px solid #fff;
}
</style>
