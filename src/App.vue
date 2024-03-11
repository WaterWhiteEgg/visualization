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
const chineseReg = /[^\u4e00-\u9fa5]/g;
// 尝试响应后端
onMounted(() => {
  getWeather("120000").then((res) => {
    console.log(res);
  });
  getCitys("天津").then((res) => {
    console.log(res);
  });
});
// 搜索城市编号
const cityText = ref("");
watch(cityText, (newVal, oldVal) => {
  const change = debounce(() => {
    // 判断是否是中文
    if (!chineseReg.test(newVal)) {
      getCitys(newVal).then((res) => {        
        cityArray.value = res.data.data?.districts;
        console.log(cityArray.value);

      });
    }
  }, 1000);
  change().then((res) => {
    // console.log(res);
  });
});
// 展示的数组
const cityArray: Ref<
  {
    citycode: string;
    adcode: string;
    name: string;
  }[]
> = ref([]);
</script>
<template>
  <div class="view">
    <div class="view_let">左视图</div>
    <div class="view_center">
      <div class="view_center_search">
        <input type="text" placeholder="搜索" v-model="cityText" />
        <div class="view_center_search_view">
          视图
          <div
            class="view_center_search_view_item"
            v-for="item in cityArray"
            :key="item.adcode"
          >
            {{ item }}
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

.view_center_search {
}

.view_center_search input {
  /* height: 4vw; */
  min-height: 4vh;
  width: 100%;
  font-size: 1rem;
  transition: all 1s;
}

.view_center_search :hover {
  height: 4vw;
  min-height: 4vh;
  transition: all 1s;
}
</style>
