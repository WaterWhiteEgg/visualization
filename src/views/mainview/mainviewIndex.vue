<script setup lang="ts">
import { onMounted, ref } from "vue";

// 搜索栏数据
const input = ref("");

// 判断是否显示列表
const isShowListFlag = ref(false);
// 切换isShowListFlag,默认直接切换
const changeIsShowListFlag = (bool: boolean = !isShowListFlag.value) => {
  isShowListFlag.value = bool;
};
</script>
<template>
  <div class="main">
    <transition
      :enter-active-class="isShowListFlag ? 'animated slideInLeft' : 'hidden'"
      :leave-active-class="isShowListFlag ? '' : 'animated slideOutLeft'"
    >
      <div
        class="main-button"
        v-if="!isShowListFlag"
        @click="changeIsShowListFlag()"
      >
        <el-icon size="30" color="#ffffffe3">
          <Expand />
        </el-icon>
      </div>
      <div class="main-list" v-else @click="null">
        <div class="main-list-head">
          <div class="main-list-head-title">
            <span>整体项目</span>
            <a href="https://github.com/WaterWhiteEgg?tab=repositories">
              <el-icon><Link /></el-icon>
            </a>
          </div>
          <!-- 搜索栏 -->
          <div>
            <el-input
              v-model="input"
              style="width: 240px"
              placeholder="Please input"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
.animated {
  animation-duration: 0.5s !important;
  /* 任何过度持续时间加快 */
}

/* 隐藏后再显示 */
.hidden {
  opacity: 0;
  transition: 0.5s all;
}

.main {
  position: absolute;
  z-index: 999999;
}

.main-button {
  width: 30px;
}

.main-list {
  width: 20vw;
  margin-top: 0.5vh;
  height: 99.5vh;
  overflow: scroll;
  background-color: #ffffff;
}

/* 隐藏滚动条 */
.main-list::-webkit-scrollbar {
  width: 0;
  height: 0;
  /* 火狐兼容 */
  -moz-appearance: none;
  scrollbar-width: none;
}

.main-list-head {
}

.main-list-head-title {
  display: flex;
  align-items: center;
  padding: 1vh 0 0 0.5vw;
}
.main-list-head-title a {
  display: flex;
}
</style>
