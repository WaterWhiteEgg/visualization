<script setup lang="ts">
import { ref } from "vue";

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
<template>用户界面</template>
<style scoped></style>
