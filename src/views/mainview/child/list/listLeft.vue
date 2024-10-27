<script setup lang="ts">
withDefaults(
  defineProps<{
    borderBottom?: string;
  }>(),
  { borderBottom: ".0313rem solid #fff" }
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
  border-bottom: .0313rem solid #fff;
}
</style>
