<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import { getWeather } from "./network/weather";
import { getCitys, getMyIp, getIpCity } from "./network/city";
import { debounce } from "./assets/ts/debounce";
import {
  forDistricts,
  type City,
  type Weather,
  type DataWeather,
} from "./assets/ts/forDistricts";
import { useCityArray } from "./stores/item";
import {
  thisInitMap,
  myChart,
  redrawValue,
  inGetWeather,
} from "./assets/ts/initMap";
import "animate.css";
const props = withDefaults(defineProps<{}>(), {});
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();

// 正则
const chineseReg = /[^0-9\u4e00-\u9fa5]/g;

// 加载化地图配置
onMounted(() => {
  thisInitMap(document.getElementById("china"), mapClick, mapStartClick);
});
// 加载getCitys的flag
const isGetCitysFinally = ref(true);
// 表示跳过本次改变搜索的flag
const isNotSelectCity = ref(false);
// 表示错误的输入的flag
const isErrorCityText = ref(false);

// 搜索城市编号
const cityText = ref("");
watch(cityText, (newVal, oldVal) => {
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
  // 判断需不需要执行,若不需要则跳过这一次
  if (!isNotSelectCity.value) {
    fn();
  }
  // 恢复状态
  isNotSelectCity.value = false;
});

const cityArray: Ref<City[]> = ref([]);

// 清除CityText的值，等于关闭搜索
const clearCityText = () => {
  // 跳过搜索
  isNotSelectCity.value = true;
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
// 地图点击后没有网络请求前回调
const mapStartClick = () => {
  isGetCitysFinally.value = false;
};
// 地图点击回调
const mapClick = () => {
  clearCityText();
  isGetCitysFinally.value = true;
  inGetWeather(useCityArray()?.localCityArray[0]?.adcode);
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
watch(
  () => useCityArray().localCityArray,
  () => {
    isHaddenBgc.value = true;

    const animate = debounce(() => {
      isHaddenBgc.value = false;
    }, 500);
    animate();
  }
);
</script>
<template>
  <div class="view">
    <div class="view_left" style="color: aliceblue">
      <div class="view_left_weather">
        <div
          class="view_left_weather_item"
          v-for="(item, index) in useCityArray().localWeather"
          :key="item.adcode + index"
        >
          <div>
            城市名
            {{ item.city }}
          </div>
          <div>
            天气状况
            {{ item.weather }}
          </div>
          <div>
            气温
            {{ item.temperature }}
          </div>
          <div>
            风力等级
            {{ item.windpower }}
          </div>
          <div>
            湿度
            {{ item.humidity }}
          </div>
          <div>
            更新时间
            {{ item.reporttime }}
          </div>
        </div>
      </div>
    </div>
    <!-- 地图绘制 -->
    <div
      id="china"
      style="width: 60vw; height: 60vh; position: absolute; bottom: 20vh"
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
  background-image: url("./assets/big_pic/bg.jpg");
  background-size: cover;
}

.view div {
  flex: 1;
}

.view_left {
}

.view .view_center {
  flex: 2;
}

.view_right {
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
  background-color: aliceblue;
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

  background-color: #1100ff;
  color: #fff;
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
  color: rgb(114, 187, 255);
}
.view_right_table_tdname {
  cursor: pointer;
}
</style>
