<script lang="ts" setup>
import { ref } from "vue";

const loading = ref<HTMLElement | null>(null);
const speed = ref(1);
const timer = ref(0);
// 动态变化颜色
withDefaults(
  defineProps<{
    color?: string;
  }>(),
  { color: "red" }
);
// 加载进度条
const startLoading = () => {
  let dom = loading.value as HTMLElement;
  speed.value = 1;
  dom.style.height = speed.value + "vh";

  // 动画帧执行完毕回调
  timer.value = window.requestAnimationFrame(function fn() {
    // 帧动画
    // window.requestAnimationFrame会让你在每一帧都执行函数，消耗性能
    // 存在递归，直到清除timer
    if (speed.value < 95) {
      speed.value += 1;
      dom.style.width = speed.value + "%";

      timer.value = window.requestAnimationFrame(fn);
    }
    //超过90 重置
    else {
      speed.value = 1;
      window.cancelAnimationFrame(timer.value);
    }
  });
};
// 完成进度条
const endLoading = () => {
  let dom = loading.value as HTMLElement;

  window.requestAnimationFrame(function () {
    speed.value = 100;
    dom.style.width = 100 + "%";
    setTimeout(() => {
      dom.style.height = 0 + "vh";
    }, 500);
  });
};
// 暴露给父组件使用ref
defineExpose({
  startLoading,
  endLoading,
});
</script>
<template>
  <div class="wraps">
    <div
      class="wraps_loading"
      :style="'background-color:' + color"
      ref="loading"
    ></div>
  </div>
</template>
<style scoped>
.wraps {
  position: absolute;
  top: 0;
  z-index: 999999;
  width: 100vw;
}

.wraps_loading {
  background-color: red;
}
</style>
