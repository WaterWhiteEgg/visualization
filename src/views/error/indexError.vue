<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import {
  previousFormRoute,
  previousErrorTofullPath,
} from "../../router/middleware";
// 实例化router，route
const router = useRouter();
const route = useRoute();

// 返回上一页
const back = () => {
  window.history.back();
};
// 返回主页
const backIndex = () => {
  router.push("/");
};
</script>
<template>
  <div class="error">
    <div class="error_title">哦吼，欢迎来到错误界面！</div>
    <div>
      你输入的网址我们无法识别，这个网址内容
      <span>{{
        previousFormRoute?.fullPath === "/"
          ? previousErrorTofullPath
          : previousFormRoute?.fullPath
      }}</span>
      可能没了，也可能是压根没有，请检查你输入的网址是否有误 你可以<span
        @click="back"
        >点击返回</span
      >也可以<span @click="backIndex">回到首页</span>
    </div>
  </div>
</template>
<style scoped>
.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  width: 100vw;
  height: 80vh;
}
.error .error_title {
  font-size: 2rem;
  font-weight: 900;
}
.error span {
  color: #ff0000;
  text-decoration: underline;
}
</style>
