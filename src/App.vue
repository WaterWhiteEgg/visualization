<script setup lang="ts">
import { onMounted, ref } from "vue";
import {getWeather} from "./network/weather"
const props = withDefaults(
  defineProps<{
  }>(),
  {
  }
);
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();
onMounted(()=>{
  getWeather("120000").then((res)=>{
    console.log(res);
    
  })
})
</script>
<template>
  <div class="view">
    <div></div>
    <div></div>
    <div></div>

  </div>
</template>
<style scoped>
.view{
  display: flex;
}
</style>
