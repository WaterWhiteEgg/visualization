<script setup lang="ts">
import { onMounted, ref, watch, defineAsyncComponent } from "vue";
import { type ECElementEvent } from "echarts";
import { getCitys } from "@/network/city";
import { debounce } from "@/assets/ts/debounce";
import { forDistricts, type City } from "@/assets/ts/forDistricts";
import { useSearchItem } from "@/stores/mapSearch";
import { useCityArray } from "@/stores/item";
import { inGetWeather } from "@/assets/ts/getWeather";
import { myPicChart } from "@/assets/ts/initPie";
import { myLineChart, redrawLineValue } from "@/assets/ts/initLine";
import {thisInitMap, myChart, redrawValue } from "@/assets/ts/initMap"
import { changeAnimation } from "../../assets/ts/child/echartsAnimationFlag";
import "animate.css";

async function asyncInit() {
  // const { myPicChart } = await import("@/assets/ts/initPie");
  // const { myLineChart, redrawLineValue } = await import("@/assets/ts/initLine");
  // const { thisInitMap, myChart, redrawValue } = await import(
  //   "@/assets/ts/initMap"
  // );
    // 子组件渲染完毕将地图中心的组件也渲染
    await thisInitMap(document.getElementById("china"), mapClick);

}

const mapOfRight = defineAsyncComponent(() => import("./child/mapOfRight.vue"));
const mapSearch = defineAsyncComponent(() => import("./child/mapSearch.vue"));
const mapOfLeft = defineAsyncComponent(() => import("./child/mapOfLeft.vue"));

// window.innerWidth <= 969 的判断flag
const isInnerWidthLess969 = ref(window.innerWidth <= 969);

// 注册监听屏幕大小的事件
onMounted(() => {
  // 加载组件数据
  asyncInit()
  window.addEventListener("resize", handleResize);
});

// 子组件的echats渲染完毕函数
const initOther = async () => {


  // 检测开始时的屏幕宽度
  isInnerWidthLess969.value = window.innerWidth <= 969;
  // 仅关闭或开启动画
  resizeAndChangeAnimation(isInnerWidthLess969.value, false);
};

// 注册监听屏幕大小的函数
const handleResize = (e: UIEvent) => {
  // console.log((e.target as Window).innerWidth);

  let resize = debounce(() => {
    // 获取屏幕宽度

    isInnerWidthLess969.value = window.innerWidth <= 969;
    // console.log(isInnerWidthLess969.value);

    // 类似媒体查询要操作的事，低于这个值应该做的事，这个值是小于pc，类平板以下的
    resizeAndChangeAnimation(isInnerWidthLess969.value);
  }, 300);
  resize();
};

// 图表的动画开关以及刷新
const resizeAndChangeAnimation = (
  isWidth: boolean,
  isResize: boolean = true
) => {
  // 图表的动画开关，决定宽少于969时动画关闭,优先检查图表是否已经创建
  // console.log(myChart, myPicChart, myLineChart);
  if (!(myChart && myPicChart && myLineChart)) {
    // 没有初始化所有图表停止修改动画属性

    return false;
  }
  changeAnimation(myChart, !isWidth);
  changeAnimation(myPicChart, !isWidth);
  changeAnimation(myLineChart, !isWidth);

  // 询问决定重新检查大小这些图表
  if (isResize) {
    myChart.resize();
    myPicChart.resize();
    myLineChart.resize();
  }
};

// 清除CityText的值，等于关闭搜索
const clearCityText = () => {
  useSearchItem().changeCityText("");
};

// 选择了某个城市触发
const ChooseCityWeather = (item: City) => {
  // console.log(item);
  // 放值到cityText
  ChooseCity(item.name);
  // 请求对应编码的天气
  inGetWeather(item.adcode);
};

// 地图点击回调
const mapClick = (e: ECElementEvent) => {
  // 准备搜索
  useSearchItem().changeIsGetCitysFinally(false);
  // 点击地图块
  let click = debounce(() => {
    // 清除cityText
    clearCityText();
    useSearchItem().changeIsGetCitysFinally(true);

    // 请求天气以及城市数据
    getCitys(e.name).then((res) => {
      // 赋值给全局
      useCityArray().addLocalCityArray(forDistricts(res.data.data?.districts));
      // 同步小圆点,重新绘制标点
      redrawValue(myChart);
      // 然后请求天气
      inGetWeather(useCityArray()?.localCityArray[0]?.adcode);
    });
  }, 300);
  click();
};
// 选择城市切换名字
const ChooseCity = (name: string) => {
  // 放值到cityText
  useSearchItem().changeCityText(name);
};

// 观察useCityArray().localCityArray
// 隐藏背景
const isHaddenBgc = ref(false);
// 动画会在数据变化时500ms内执行变化flag使得过渡生效
watch(
  () => useCityArray().localCityArray,
  () => {
    // 改变时刷新图标数据
    redrawLineValue(myLineChart);

    console.log(isInnerWidthLess969.value);
    // 手机端不执行
    if (!isInnerWidthLess969.value) {
      isHaddenBgc.value = true;
    }
    const animate = debounce(() => {
      // 手机端不执行
      if (!isInnerWidthLess969.value) {
        isHaddenBgc.value = false;
      }
    }, 500);
    animate();
  }
);
// 观察bom
</script>
<template>
  <div class="view">
    <!-- 地图绘制 -->
    <mapOfLeft @initOther="initOther"></mapOfLeft>
    <div
      id="china"
      style="width: 100vw; height: 60vh; position: absolute; bottom: 20vh"
    ></div>
    <div class="view_center">
      <mapSearch @chooseCityWeather="ChooseCityWeather"></mapSearch>
    </div>

    <div class="view_right">
      <mapOfRight
        :is="mapOfRight"
        :isHaddenBgc="isHaddenBgc"
        @chooseCityWeather="ChooseCityWeather"
      ></mapOfRight>
    </div>
  </div>
</template>
<style scoped>
@keyframes anim1 {
  0% {
    transform: scale(1) rotate(0deg); /* 初始状态为原始大小和角度 */
  }
  10% {
    transform: scale(1.01) rotate(0deg); /* 初始状态为原始大小和角度 */
  }
  20% {
    transform: scale(1.2) rotate(5deg);
  }
  50% {
    transform: scale(1.5) rotate(10deg);
  }

  70% {
    transform: scale(1.5) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}
.animated {
  /* 任何过度持续时间加快 */
  animation-duration: 0.5s !important;
}

/* 背景隐藏 */
.bgc-hid {
  background-color: #ffffff00 !important;
  color: #fff00000 !important;
}

/* 高度最大屏幕 */
.hig {
  height: 100% !important;
}

.view {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  justify-content: center;
  /* background-image: url("./assets/big_pic/bg.jpg"); */
  /* background-size: cover; */
  background-color: blue;
}
.view::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /* 增大宽度以覆盖整个盒子 */
  height: 100%;
  background-image: url("@/assets/big_pic/bg.jpg");
  background-size: cover;
  animation: anim1 10s infinite cubic-bezier(0.25, 0.1, 0.25, 0.25); /* 添加旋转动画效果 */
}

/* 隐藏滚动条 */
.view::-webkit-scrollbar {
  width: 0;
  height: 0;

  /* 火狐兼容 */
  -moz-appearance: none;
  scrollbar-width: none;
}

.view .view_center {
  flex: 2;
}

.view_right {
  display: flex;
  flex: 1;
}

@media screen and (max-width: 969px) {
  /* 手机 */
  /* 类平板 */
  /* 取消宽度调整 */
  .animated {
    /* 取消任何过度持续时间 */
    animation-duration: 0s !important;
  }
  .hig {
    height: 100% !important;
  }

  .view {
    flex-direction: column;
    overflow: scroll;
    justify-content: start;
    background-image: url("@/assets/big_pic/bg.jpg");
    background-size: cover;
  }
  .view::before {
    animation: anim1 0s;
    background: none;
  }

  .view_center {
    margin-bottom: 75vh;

    order: -99;
  }
}

@media screen and (min-width: 970px) {
  /* 大屏幕电脑 */
}
</style>
