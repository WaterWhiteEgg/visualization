<script setup lang="ts">
import { onMounted } from "vue";
import { initPie } from "@/assets/ts/initPie";
import { initLine } from "@/assets/ts/initLine";
import { useCityArray } from "@/stores/item";

// const props = withDefaults(
//   defineProps<{
//     msg: string;
//   }>(),
//   {
//     msg: "",
//   }
// );
const emits = defineEmits<{
  (e: "initOther", i: void): void;
}>();

// 监听图表以及响应式调整窗口
onMounted(() => {
  initPie(document.querySelector(".view_left_pie"));
  initLine(document.querySelector(".view_left_line"));
  emits("initOther");
});
</script>
<template>
  <div class="view_left">
    <div class="view_left_weather animated fadeInDown">
      <transition-group enter-active-class="animated rotateInDownLeft">
        <div
          class="view_left_weather_item"
          v-for="(item, index) in useCityArray().localWeather"
          :key="item.adcode + index"
        >
          <div>
            <span>城市名</span>
            {{ item.city }}
          </div>
          <div>
            <span>天气状况</span>
            {{ item.weather }}
          </div>
          <div>
            <span>气温</span>
            {{ item.temperature }}°
          </div>
          <div>
            <span> 风力等级 </span>
            {{ item.windpower }}
          </div>
          <div>
            <span>湿度</span>
            {{ item.humidity }}
          </div>
          <div>
            <span> 更新时间 </span>
            {{ item.reporttime }}
          </div>
        </div>
      </transition-group>
    </div>
    <div class="view_left_pie"></div>
    <div class="view_left_line"></div>
  </div>
</template>
<style scoped>
.animated {
  /* 任何过度持续时间加快 */
  animation-duration: 0.5s !important;
}
.view_left {
  flex: 1;
  margin-top: 10vh;
  margin-left: 2vw;
}

.view_left_weather {
  display: flex;
  position: relative;
  height: 20vh;
  width: 20vw;
  min-width: 210px;
  max-width: 250px;
  max-height: 140px;
  font-size: 0.8rem;
}

.view_left_weather_item {
  display: flex;
  flex-wrap: wrap;
}

.view_left_weather_item div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 5vw;
  width: 5vw;
  min-height: 70px;
  min-width: 70px;
  overflow: hidden;
  border: 0.2px solid #ffffff6b;
  color: #fff;
  background-color: #1100ff65;
  backdrop-filter: blur(10px);
  /* 添加模糊效果 */
}

.view_left_pie {
  margin-top: 5vh;
  width: 20vw;
  height: 30vh;
  z-index: 99999;
}

.view_left_line {
  position: absolute;
  width: 40vw;
  height: 35vh;
  z-index: 9999;
}

@media screen and (max-width: 969px) {
  /* 手机 */
  /* 类平板 */
  /* 取消宽度调整 */
  .animated {
    /* 取消任何过度持续时间 */
    animation-duration: 0s !important;
  }
  .view_left {
    margin: 0;
    /* 提供绝对定位的视窗 */
    padding-bottom: 40vh;
  }

  .view_left_weather {
    max-width: none;
    max-height: none;
    min-height: 0;
    min-width: 0;
    width: 100vw;
    height: 18vh;

    margin: 0;
    align-items: start;
    justify-content: start;
    overflow: scroll;
  }

  /* 隐藏滚动条 */
  .view_left_weather::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .view_left_weather_item {
    max-width: none;
    max-height: none;
    min-height: 0;
    min-width: 0;
    align-items: start;
    justify-content: start;
  }

  .view_left_weather_item div {
    max-width: none;
    max-height: none;
    min-height: 40px;
    min-width: 0;
    width: 50vw;
    height: 6vh;
  }

  .view_left_pie {
    margin-top: 0;
    width: 100vw;
    height: 40vh;
  }

  .view_left_line {
    margin-top: 0;
    width: 100vw;
    height: 40vh;
  }
}
</style>
