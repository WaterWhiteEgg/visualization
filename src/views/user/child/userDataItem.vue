<script setup lang="ts">
import { ref, toRefs, onMounted, onBeforeUnmount, type Ref } from "vue";
import { usePopup } from "@/stores/popup";

import { type UserData } from "@/network/user";
import { useRoute, useRouter } from "vue-router";
import itemAvatar from "./item/itemAvatar.vue";
import itemUsername from "./item/itemUsername.vue";

const props = withDefaults(
  defineProps<{
    userData: UserData;
    isShowMainUserFlag: boolean;
  }>(),
  {
    userData: undefined,
    isShowMainUserFlag: false,
  }
);
// 挂载route实例
const route = useRoute();
// 挂载router实例
const router = useRouter();

// 头像更换弹窗开关
const dialogVisibleAvatar = ref(false);

// 名字更换弹窗开关
const dialogVisibleUsername = ref(false);
</script>
<template>
  <div class="user_item" v-if="isShowMainUserFlag">
    <div class="user_item_title">
      <el-icon><Tools /></el-icon>
      <span>设置</span>
    </div>

    <el-button
      icon="PictureFilled"
      @click="dialogVisibleAvatar = true"
      v-if="!(userData?.is_guest)"
    >
      更换头像
    </el-button>

    <el-dialog v-model="dialogVisibleAvatar" title="更换头像" width="90vw" draggable>
      <itemAvatar></itemAvatar>
    </el-dialog>

    <el-button
      icon="PictureFilled"
      @click="dialogVisibleUsername = true"
      v-if="!(userData?.is_guest)"
    >
      更换名字
    </el-button>

    <el-dialog v-model="dialogVisibleUsername" title="更换名字" width="90vw" draggable>
      <itemUsername :userData="userData"></itemUsername>
    </el-dialog>
  </div>
</template>
<style scoped>
.user_item {
  width: 80vw;
  margin: 0 auto;
  font-size: 0.8rem;
  background-color: #ffffff;
}
.user_item_title {
  position: relative;
  display: flex;
  padding: 1vh 1vw;
  margin-bottom: 1vh;
  align-items: center;
  font-size: 1rem;
}
.user_item_title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 30vw; /* 设置下划线的宽度 */
  height: 1px; /* 下划线的高度 */
  background-color: #c4c4c4; /* 下划线的颜色 */
}
.user_item_title span {
  padding-left: 0.5vw;

  font-weight: 900;
}
</style>
