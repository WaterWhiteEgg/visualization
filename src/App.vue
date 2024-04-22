<script setup lang="ts">
import mainviewIndex from "./views/mainview/mainviewIndex.vue"
</script>
<template>
  <div class="appview">
    <mainviewIndex></mainviewIndex>
    <router-view></router-view>
  </div>
</template>
<style scoped>
.appview{
  display: flex;
}
</style>
