<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import { getWeather } from "./network/weather";
import { getCitys } from "./network/city";
import { debounce } from "./assets/ts/debounce";
const props = withDefaults(defineProps<{}>(), {});
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();

// 正则
const chineseReg = /[^0-9\u4e00-\u9fa5]/g;
// 尝试响应后端
onMounted(() => {
  getWeather("120000").then((res) => {
    console.log(res);
  });
  getCitys("天津").then((res) => {
    console.log(res);
  });
});
// 加载getCitys的flag
const isGetCitysFinally = ref(false)


// 搜索城市编号
const cityText = ref("");
watch(cityText, (newVal, oldVal) => {
  const fn = debounce(() => {
    // 判断是否是中文
    if (!chineseReg.test(newVal)) {
      // 加载中flag
      isGetCitysFinally.value = false
      getCitys(newVal).then((res) => {

        // 获得内容数组
        let allArray = res.data.data?.districts as City[]
        // 将所有的districts获取
        const forDistricts = (inAllArray: City[]) => {
          // console.log(inAllArray);
          inAllArray.forEach((item) => {
            // console.log(item);
            // 判断是否再次遍历
            let isAgain = false
            //  递归

            if (item.districts.length !== 0) {
              isAgain = true
              allArray = allArray.concat(item.districts)
            }
            if (isAgain) {
              forDistricts(item.districts)
            }
          })
        }
        forDistricts(allArray)
        cityArray.value = allArray;

      })
        // 加载完成后提示
        .finally(() => {
          // 加载完flag
          isGetCitysFinally.value = true
        })
    }
    // 不符合规则将提示
    else {

    }
  }, 500);
  fn()
});
// 展示的数组
type City = {
  citycode: string;
  adcode: string;
  name: string;
  level: string,
  center: string,
  districts: City[]
}
const cityArray: Ref<
  City[]
> = ref([]);

// 清除CityText的值，等于关闭搜索
const clearCityText = () => {
  cityText.value = ''
}
// 选择了某个城市触发
const ChooseCityWeather = (item: City) => {
  // 请求对应编码的天气
  getWeather(item.adcode).then((res) => {
    console.log(res);
  });
// console.log(item);

}


</script>
<template>
  <div class="view">
    <div class="view_let">左视图</div>
    <div class="view_center">
      <div class="view_center_search">
        <div class="view_center_search_input">
          <input type="text" placeholder="搜索" v-model="cityText" />
          <span class="view_center_search_input_close" v-show="cityText !== ''" @click="clearCityText">
            <el-icon>
              <Close />
            </el-icon>
          </span>
        </div>
        <div class="view_center_search_view" v-if="cityText !== ''">
          <div v-show="!isGetCitysFinally">{{ "加载中。。。" }}</div>
          <div v-show="cityArray.length === 0 && isGetCitysFinally && !chineseReg.test(cityText)">{{ `搜索失败，请遵循以下规则
            ：只支持单个关键词语搜索关键词支持:行政区名称、城市编码、邮件编码
            例如，搜索省份（例如山东），能够显示市（例如济南），区（例如历下区）`
            }}</div>
          <div class="view_center_search_view_item" v-for="(item, index) in cityArray" :key="item.adcode"
            v-if="isGetCitysFinally" @click="ChooseCityWeather(item)">

            <div class="view_center_search_view_item_index"> {{ index }}</div>
            <div class="view_center_search_view_item_name">{{ item.name }}</div>
            <div class="view_center_search_view_item_adcode">{{ item.adcode }}</div>

          </div>
        </div>
      </div>
    </div>
    <div class="view_right">右视图</div>
  </div>
</template>
<style scoped>
.view {
  display: flex;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
  background-color: rgb(128, 168, 255);
}

.view div {
  flex: 1;
}

.view_let {
  background-color: red;
}

.view .view_center {
  flex: 2;
}

.view_right {
  background-color: blue;
}

.view_center_search {}

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

  transition: all .5s;
}

.view_center_search_input_close {
  display: block;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}

.view_center_search_view {
  height: 40vh;
  overflow: scroll;
  background-color: aliceblue;
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
  border: .5px dotted #8299ff;

}

.view_center_search_view_item .view_center_search_view_item_index {
  flex: .5;
  color: #0021dd;
}

.view_center_search_view_item .view_center_search_view_item_name {
  flex: 3;
  font-weight: 900;

}

.view_center_search_view_item .view_center_search_view_item_adcode {}
</style>
