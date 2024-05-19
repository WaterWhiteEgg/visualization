<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { debounce } from "@/assets/ts/debounce";
import { getCitys } from "@/network/city";
import { useSearchItem } from "@/stores/mapSearch";
import { useCityArray } from "@/stores/item";
import { forDistricts, type City } from "@/assets/ts/forDistricts";
import { myChart, redrawValue } from "@/assets/ts/initMap";

const emits = defineEmits<{
  (e: "chooseCityWeather", i: City): void;
}>();
// 正则
const chineseReg = /[^0-9\u4e00-\u9fa5]/g;
// 临时的cityArray
const searchCityArray: Ref<City[]> = ref([]);
// 搜索城市编号
watch(
  () => useSearchItem().cityText,
  (newVal) => {
    // 防抖
    const fn = debounce(() => {
      // 加载 flag
      useSearchItem().changeIsGetCitysFinally(false);
      // 判断是否是中文且有内容
      if (!chineseReg.test(newVal.trim()) && newVal.trim() !== "") {
        getCitys(newVal.trim())
          .then((res) => {
            // 获得内容数组
            // console.log(res);
            searchCityArray.value = forDistricts(
              res.data.data?.districts as City[]
            );
          })
          // 加载完成后提示
          .finally(() => {
            // 加载完 flag
            useSearchItem().changeIsGetCitysFinally(true);
            // 观察有没有内容，没有就报错
            if (searchCityArray.value.length === 0) {
              useSearchItem().changeIsErrorCityText(true);
            } else {
              useSearchItem().changeIsErrorCityText(false);

              // 同步刷新数据
              redrawData();
            }
          });
      }
      // 不满足条件，提示问题
      else {
        // 清除searchCityArray
        searchCityArray.value = [];
        // 隐藏flag
        useSearchItem().changeIsGetCitysFinally(true);
        // 提示错误
        useSearchItem().changeIsErrorCityText(true);
      }
    }, 500);

    // 执行上面的方法
    fn();
  }
);
// 切换 useSearchItem().cityText
const changeInput = (e: Event) => {
  let eValue = (e.target as HTMLInputElement).value;
  useSearchItem().changeCityText(eValue);
};
// 同步数据以及刷新地图
const redrawData = () => {
  // 将数据同步表格

  useCityArray().addLocalCityArray(searchCityArray.value);
  // 刷新地图的标点
  redrawValue(myChart);
};

// 判断焦点flag
const isFocus = ref(false);
// 切换焦点flag
const changeFocus = (Boolean: boolean) => {
  isFocus.value = Boolean;
};

// 删除cityText的内容，关闭搜索列
const closeSearch = () => {
  useSearchItem().changeCityText("");
  changeFocus(false);
};

// 选择了某个城市触发
const ChooseCityWeather = (item: City) => {
  emits("chooseCityWeather", item);
};
</script>
<template>
  <div class="view_center_search">
    <div style="color: #fff" v-show="!useSearchItem().isGetCitysFinally">
      加载中
    </div>
    <div class="view_center_search_input">
      <input
        type="text"
        placeholder="搜索"
        :value="useSearchItem().cityText"
        @focus="changeFocus(true)"
        @input="changeInput"
      />
      <span
        class="view_center_search_input_close"
        v-show="isFocus"
        @click="closeSearch"
      >
        <el-icon>
          <Close />
        </el-icon>
      </span>
    </div>
    <div class="view_center_search_view" v-if="isFocus">
      <div v-show="!useSearchItem().isGetCitysFinally">
        {{ "加载中。。。" }}
      </div>
      <div
        v-show="
          (useSearchItem().cityText.length === 0 &&
            useSearchItem().isErrorCityText &&
            useSearchItem().isGetCitysFinally) ||
          searchCityArray.length === 0
        "
      >
        {{
          `请遵循以下规则查找：
            只支持单个关键词语搜索关键词支持:行政区名称、城市编码、邮件编码
            例如，搜索省份（例如山东），能够显示市（例如济南），区（例如历下区）,若你频繁看到提示，可能输入的关键词有误或网络错误`
        }}
      </div>
      <div v-if="useSearchItem().isGetCitysFinally">
        <div
          class="view_center_search_view_item"
          v-for="(item, index) in searchCityArray"
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
</template>
<style scoped>
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

  /* 火狐兼容 */
  -moz-appearance: none;
  scrollbar-width: none;
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
