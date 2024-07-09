<script setup lang="ts">
import mainviewIndex from "./views/mainview/mainviewIndex.vue";

import {usePopup} from "./stores/popup"
</script>
<template>
  <div class="appview">
    <mainviewIndex v-if="usePopup().isOpenMainviewIndex"></mainviewIndex>
    <router-view></router-view>
  </div>
</template>
<style scoped>
.appview {
  display: flex;
  height: 100vh;
  width: 100vw;
}

@media screen and (max-width: 969px) {
  /* 手机 */
  /* 类平板 */
  .appview {
    flex-direction: column;
  }
}
</style>
