<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import { getCitys } from "@/network/city";
import { debounce } from "@/assets/ts/debounce";
import { forDistricts, type City } from "@/assets/ts/forDistricts";
import { useCityArray } from "@/stores/item";
import {
  thisInitMap,
  myChart,
  redrawValue,
  inGetWeather,
} from "@/assets/ts/initMap";
import { initPie, myPicChart } from "@/assets/ts/initPie";
import { initLine, myLineChart, redrawLineValue } from "@/assets/ts/initLine";
import "animate.css";

// 正则
const chineseReg = /[^0-9\u4e00-\u9fa5]/g;

// 加载化地图配置
onMounted(() => {
  thisInitMap(document.getElementById("china"), mapClick);
  initPie(document.querySelector(".view_left_pie"));
  initLine(document.querySelector(".view_left_line"));

  // 注册监听屏幕大小的事件
  window.addEventListener("resize", handleResize);
});
// 屏幕大小改变触发事件
const thisInnerWidth = ref(window.innerWidth);
const handleResize = () => {
  let resize = debounce(() => {
    thisInnerWidth.value = window.innerWidth;
    myChart.resize();
    myPicChart.resize();
    myLineChart.resize();
  }, 300);
  resize();
};

// 加载getCitys的flag
const isGetCitysFinally = ref(true);

// 表示错误的输入的flag
const isErrorCityText = ref(false);

// 搜索城市编号
const cityText = ref("");
watch(cityText, (newVal) => {
  // 防抖
  const fn = debounce(() => {
    // 加载中flag
    isGetCitysFinally.value = false;
    // 判断是否是中文且有内容
    if (!chineseReg.test(newVal.trim()) && newVal.trim() !== "") {
      getCitys(newVal.trim())
        .then((res) => {
          // 获得内容数组
          // console.log(res);
          cityArray.value = forDistricts(res.data.data?.districts as City[]);
        })
        // 加载完成后提示
        .finally(() => {
          // 加载完flag
          isGetCitysFinally.value = true;
          // 观察有没有内容，没有就报错
          if (cityArray.value.length === 0) {
            isErrorCityText.value = true;
          } else {
            isErrorCityText.value = false;
            // 同步刷新数据
            redrawData();
          }
        });
    }
    // 不满足条件，提示问题
    else {
      // 隐藏flag
      isGetCitysFinally.value = true;
      // 提示
      isErrorCityText.value = true;
    }
  }, 500);

  // 执行上面的方法
  fn();
});

const cityArray: Ref<City[]> = ref([]);

// 清除CityText的值，等于关闭搜索
const clearCityText = () => {
  cityText.value = "";
};
// 选择了某个城市触发
const ChooseCityWeather = (item: City) => {
  // console.log(item);
  // 放值到cityText
  ChooseCity(item.name);
  // 请求对应编码的天气
  inGetWeather(item.adcode);
};

// 同步数据以及刷新地图
const redrawData = () => {
  // 将数据同步表格

  useCityArray().addLocalCityArray(cityArray.value);
  // 刷新地图的标点
  redrawValue(myChart);
};

// 地图点击回调
const mapClick = (e: echarts.ECElementEvent) => {
  // 准备搜索
  isGetCitysFinally.value = false;
  // 点击地图块
  let click = debounce(() => {
    // 清除cityText
    clearCityText();
    isGetCitysFinally.value = true;
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
  cityText.value = name;
};
// 判断焦点flag
const isFocus = ref(false);
// 切换焦点flag
const changeFocus = (Boolean: boolean) => {
  isFocus.value = Boolean;
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
    isHaddenBgc.value = true;
    const animate = debounce(() => {
      isHaddenBgc.value = false;
    }, 500);
    animate();
  }
);
// 观察bom
</script>
<template>
  <div class="view">
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
    <!-- 地图绘制 -->
    <div
      id="china"
      style="width: 100vw; height: 60vh; position: absolute; bottom: 20vh"
    ></div>
    <div class="view_center">
      <div class="view_center_search">
        <div style="color: #fff" v-show="!isGetCitysFinally">加载中</div>
        <div class="view_center_search_input">
          <input
            type="text"
            placeholder="搜索"
            v-model="cityText"
            @focus="changeFocus(true)"
          />
          <span
            class="view_center_search_input_close"
            v-show="isFocus"
            @click="clearCityText(), changeFocus(false)"
          >
            <el-icon>
              <Close />
            </el-icon>
          </span>
        </div>
        <div class="view_center_search_view" v-if="isFocus">
          <div v-show="!isGetCitysFinally">
            {{ "加载中。。。" }}
          </div>
          <div
            v-show="
              cityArray.length === 0 && isErrorCityText && isGetCitysFinally
            "
          >
            {{
              `请遵循以下规则查找：
            只支持单个关键词语搜索关键词支持:行政区名称、城市编码、邮件编码
            例如，搜索省份（例如山东），能够显示市（例如济南），区（例如历下区）,若你频繁看到提示，可能输入的关键词有误或网络错误`
            }}
          </div>
          <div v-if="isGetCitysFinally">
            <div
              class="view_center_search_view_item"
              v-for="(item, index) in cityArray"
              :key="item.adcode + index"
              @click="ChooseCityWeather(item), changeFocus(false)"
            >
              <div class="view_center_search_view_item_index">
                {{ index + 1 }}
              </div>
              <div class="view_center_search_view_item_name">
                {{ item.name }}
              </div>
              <div class="view_center_search_view_item_adcode">
                {{ item.adcode }}
              </div>
            </div>
          </div>
        </div>
      </div>
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
  animation-duration: 0.5s !important;
  /* 任何过度持续时间加快 */
}

/* 背景隐藏 */
.bgc-hid {
  background-color: #ffffff00 !important;
  color: #fff00000 !important;
}

/* 高度最大屏幕 */
.hig {
  height: 100vh !important;
}

.view {
  position: relative;
  display: flex;
  height: 100vh;
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

.view .view_center {
  flex: 2;
}

.view_center_search {
}

.view_center_search_input {
  position: relative;
  display: flex;
}

.view_center_search_input input {
  min-height: 2.5vw;
  width: 100%;
  font-size: 1rem;
  border: 0px;
  border-radius: 2rem;

  transition: all 0.5s;
}

.view_center_search_input_close {
  display: block;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.view_center_search_view {
  position: relative;
  height: 40vh;
  overflow: scroll;
  background-color: #f0f8ff;
  z-index: 9999;
}

/* 隐藏滚动条 */
.view_center_search_view::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.view_center_search_view_item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.view_center_search_view_item div {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4vh;
  min-height: 20px;
  border: 0.5px dotted #8299ff;
}

.view_center_search_view_item .view_center_search_view_item_index {
  flex: 0.5;
  color: #0021dd;
}

.view_center_search_view_item .view_center_search_view_item_name {
  flex: 3;
  font-weight: 900;
  white-space: nowrap;
  /* 保证文本在一行内显示 */
  overflow: hidden;
  /* 隐藏溢出的内容 */
  text-overflow: ellipsis;
  /* 文字溢出显示省略号 */
}

.view_center_search_view_item .view_center_search_view_item_adcode {
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
