<script setup lang="ts">
import { useCityArray } from "@/stores/item";
import { type City } from "@/assets/ts/forDistricts";

const props = defineProps<{
  isHaddenBgc: boolean;
}>();
const emits = defineEmits<{
  (e: "chooseCityWeather", i: City): void;
}>();

// 请求天气以及城市数据
const rightChooseCityWeather = (item: City) => {
  emits("chooseCityWeather", item);
};
</script>

<template>
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
            @click="rightChooseCityWeather(item)"
          >
            {{ item.name }}
          </td>
          <td>{{ item.adcode }}</td>
          <td>{{ item.level }}</td>
        </tr>
      </TransitionGroup>
    </table>
  </div>
</template>

<style scoped>
.animated {
  /* 任何过度持续时间加快 */
  animation-duration: 0.5s !important;
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

.view_right_table_tdname {
  cursor: pointer;
}
.view_right_table_tdname:hover {
  color: #72bbff;
}

@media screen and (max-width: 969px) {
  /* 手机 */
  /* 类平板 */
  /* 取消宽度调整 */

  .view_right_table {
    margin: 0;
  }

  .view_right_table table {
    width: 100vw;
  }
}
</style>
