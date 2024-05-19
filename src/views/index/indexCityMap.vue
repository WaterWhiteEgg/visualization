<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import { type ECElementEvent } from "echarts";
import { getCitys } from "@/network/city";
import { debounce } from "@/assets/ts/debounce";
import { forDistricts, type City } from "@/assets/ts/forDistricts";
import { useSearchItem } from "@/stores/mapSearch";
import { useCityArray } from "@/stores/item";
import {
  thisInitMap,
  myChart,
  redrawValue,
  inGetWeather,
} from "@/assets/ts/initMap";
import { initPie, myPicChart } from "@/assets/ts/initPie";
import { initLine, myLineChart, redrawLineValue } from "@/assets/ts/initLine";
import { changeAnimation } from "../../assets/ts/child/echartsAnimationFlag";

import mapOfLeft from "./child/mapOfLeft.vue";
import mapSearch from "./child/mapSearch.vue";

import "animate.css";

// 加载化地图配置
onMounted(() => {
  thisInitMap(document.getElementById("china"), mapClick);
  // 注册监听屏幕大小的事件
  window.addEventListener("resize", handleResize);
});
// 屏幕大小改变触发事件
const thisInnerWidth = ref(window.innerWidth);
// thisInnerWidth.value <= 969
const isInnerWidthLess969 = ref(false);

// 注册监听屏幕大小的函数
const handleResize = (e: UIEvent) => {
  // console.log((e.target as Window).innerWidth);

  let resize = debounce(() => {
    // 获取屏幕宽度
    thisInnerWidth.value = (e.target as Window).innerWidth;
    isInnerWidthLess969.value = thisInnerWidth.value <= 969;
    // console.log(isInnerWidthLess969.value);

    // 类似媒体查询要操作的事，低于这个值应该做的事，这个值是小于pc，类平板以下的
    if (isInnerWidthLess969) {
      changeAnimation(myChart, false);
      changeAnimation(myPicChart, false);
      changeAnimation(myLineChart, false);
    }
    myChart.resize();
    myPicChart.resize();
    myLineChart.resize();
  }, 300);
  resize();
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
    // 手机端不执行
    isInnerWidthLess969.value ? null : (isHaddenBgc.value = true);
    const animate = debounce(() => {
      // 手机端不执行
      isInnerWidthLess969.value ? null : (isHaddenBgc.value = false);
    }, 500);
    animate();
  }
);
// 观察bom
</script>
<template>
  <div class="view">
    <!-- 地图绘制 -->
    <mapOfLeft></mapOfLeft>
    <div
      id="china"
      style="width: 100vw; height: 60vh; position: absolute; bottom: 20vh"
    ></div>
    <div class="view_center">
      <mapSearch @chooseCityWeather="ChooseCityWeather"></mapSearch>
    </div>

    <div class="view_right">
      <div
        class="view_right_table animated fadeInDown"
        :class="{ hig: isHaddenBgc }"
      >
        <table :class="{ 'bgc-hid': isHaddenBgc }">
          <tr>
            <th>顺序</th>
            <th>城市编号</th>
            <th>名称</th>
            <th>城市编码</th>
            <th>等级</th>
          </tr>
          <TransitionGroup
            enter-active-class="animated fadeInRight"
            leave-active-class="animated fadeOutLeft"
            tag="tbody"
          >
            <tr
              v-for="(item, index) in useCityArray().localCityArray"
              :key="item.adcode + index"
            >
              <td style="text-align: center">{{ index + 1 }}</td>
              <td>
                {{ item.citycode?.length === 0 ? "无编号" : item.citycode }}
              </td>
              <td
                class="view_right_table_tdname"
                @click="ChooseCityWeather(item)"
              >
                {{ item.name }}
              </td>
              <td>{{ item.adcode }}</td>
              <td>{{ item.level }}</td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
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

.view_right_table {
  display: flex;
  justify-content: right;
  height: 50vh;
  margin-top: 10vh;
  transition: 0.5s all;
  overflow: scroll;
}

/* 隐藏滚动条 */
.view_right_table::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.view_right_table table {
  height: 8vh;
  width: 20vw;

  transition: 0.5s all;

  background-color: #877eff;
  color: #ffffff;
}

.view_right_table tr {
  background-color: rgb(0, 0, 0);
}

.view_right_table th {
  color: rgb(206, 248, 255);
}

.view_right_table th,
.view_right_table td {
  max-width: 6vw;
  white-space: nowrap;
  /* 保证文本在一行内显示 */
  overflow: hidden;
  /* 隐藏溢出的内容 */
  text-overflow: ellipsis;
  /* 文字溢出显示省略号 */
}

.view_right_table td:hover {
  color: #72bbff;
}

.view_right_table_tdname {
  cursor: pointer;
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

  .view_center_search input {
    height: 5vh;
    min-height: 20px;
    border-radius: 0;
    background-color: #beedffe0;
  }

  .view_center_search {
  }

  .view_right {
  }

  .view_right_table {
    margin: 0;
  }

  .view_right_table table {
    width: 100vw;
  }
}

@media screen and (min-width: 970px) {
  /* 大屏幕电脑 */
  .view {
  }
}
</style>
