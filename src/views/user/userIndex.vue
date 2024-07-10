<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { usePopup } from "@/stores/popup";
import { useRegister } from "@/stores/register";

// 挂载中
onMounted(() => {
  // 取消显示mainviewIndex
  // usePopup().changeisOpenMainviewIndex(false);
  
  // 由于在解析token时已经获取到数据了，但为了安全起见，进入这个界面需要再一次验证token
  // 1验证token是否正确，
  // 1.1如不正确则让他滚去/login再搞一个
  // 1.2若正确，查看token解析出来的id是否是动态路由上传的值
  // 2如果是则进入个人界面提供更多操作
  // 2.1如果不是，则进入基础面板信息

  // 3若token没有，则无论如何都进入基础面板信息
}),
  // 销毁前
  onBeforeUnmount(() => {
    // 重新显示mainviewIndex
    // usePopup().changeisOpenMainviewIndex(true);
  });
const props = withDefaults(
  defineProps<{
    msg: string;
  }>(),
  {}
);
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();
</script>
<template>
  <div class="user">
    <div class="user_title">img</div>
    <div class="user_message">{{ useRegister().userData }}</div>
    <div class="user_item">item</div>
  </div>
</template>
<style scoped>
.user {
  display: flex;
  flex-direction: column;
}
.user_title {
  width: 100vw;
  height: 20vh;
  background-color: red;
}
.user_message {
  width: 100vw;
}
</style>
