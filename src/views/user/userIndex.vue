<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { usePopup } from "@/stores/popup";

// 挂载中
onMounted(() => {
  // 取消显示mainviewIndex
  usePopup().changeisOpenMainviewIndex(false);
}),
  // 销毁前
  onBeforeUnmount(() => {
    // 重新显示mainviewIndex
    usePopup().changeisOpenMainviewIndex(true);
  });
const props = withDefaults(
  defineProps<{
    msg: string;
  }>(),
  {
    msg: "",
  }
);
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();
</script>
<template><div style="background-color: red">用户界面</div></template>
<style scoped></style>
