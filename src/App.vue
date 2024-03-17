<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import { getWeather } from "./network/weather";
import { getCitys } from "./network/city";
import { debounce } from "./assets/ts/debounce";
import { forDistricts, type City } from "./assets/ts/forDistricts";
import initMap from "./assets/ts/initMap";

const props = withDefaults(defineProps<{}>(), {});
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();

// 正则
const chineseReg = /[^0-9\u4e00-\u9fa5]/g;

// 加载化地图配置
onMounted(() => {
  initMap(document.getElementById("china"));
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
  const fn = debounce(() => {
    // 判断是否是中文且有内容
    if (!chineseReg.test(newVal.trim()) && newVal.trim() !== "") {
      // 加载中flag
      isGetCitysFinally.value = false;

      getCitys(newVal.trim())
        .then((res) => {
          // 获得内容数组
          cityArray.value = forDistricts(res.data.data?.districts as City[]);
        })
        // 加载完成后提示
        .finally(() => {
          // 加载完flag
          isGetCitysFinally.value = true;
          // 观察有没有内容，没有就报错
          cityArray.value.length === 0
            ? (isErrorCityText.value = true)
            : (isErrorCityText.value = false);
        });
    }
    // 不满足条件，提示问题
    else {
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
  console.log(item);

  // 放值到cityText
  cityText.value = item.name;

  // 请求对应编码的天气
  getWeather(item.adcode).then((res) => {
    console.log(res);
  });
  // console.log(item);
};
// 判断焦点flag
const isFocus = ref(false);
// 切换焦点flag
const changeFocus = (Boolean: boolean) => {
  isFocus.value = Boolean;
};
</script>
<template>
  <div class="view">
    <div class="view_let">左视图</div>
    <!-- 地图绘制 -->
    <div
      id="china"
      style="width: 70vw; height: 70vh; position: absolute; bottom: 10vh"
    ></div>
    <div class="view_center">
      <div class="view_center_search">
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
              :key="item.adcode"
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
    <div class="view_right">右视图</div>
  </div>
</template>
<style scoped>
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

.view_let {
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
}

.view_center_search_view::-webkit-scrollbar {
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
</style>
