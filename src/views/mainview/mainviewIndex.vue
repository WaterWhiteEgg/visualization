<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import indexList from "./child/indexList.vue";
import indexSearch from "./child/indexSearch.vue";
import { useRegister, type ParseUserData } from "../../stores/register";
import { useRouter } from "vue-router";

const props = withDefaults(
  defineProps<{
    color: string;
  }>(),
  {
    color: "#ffffff",
  }
);

// 实例化
const router = useRouter();
// 组件的ref
const listRef = ref<HTMLElement | null>(null);
// 挂载时
onMounted(() => {
  // 添加事件监听
  document.addEventListener("click", handleClickOutside);
});
// 卸载时
// 清除事件监听
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// 处理handleClickOutside点击事件
const handleClickOutside = (event: MouseEvent) => {
  // 判断是否点击在列表之外
  if (listRef.value && !listRef.value.contains(event.target as Node)) {
    changeIsShowListFlag(false); // 点击外部区域，关闭列表
    // console.log(!listRef.value.contains(event.target as Node));
  }
};

// 判断是否显示列表
const isShowListFlag = ref(false);
// 切换isShowListFlag,默认直接切换
const changeIsShowListFlag = (bool: boolean = !isShowListFlag.value) => {
  isShowListFlag.value = bool;
  console.log("切换bool" + bool);
};

// 前往/user 还需要额外给名字
const toUser = () => {
  let inUserData = JSON.parse(useRegister().userData) as ParseUserData;
  // 判断是否登录验证过了，没有相对应数据就让其跳转登录
  inUserData.user_id === "0"
    ? router.push("/login")
    : router.push("/user/" + inUserData.user_id);
};
</script>
<template>
  <div class="main" ref="listRef">
    <Transition
      :enter-active-class="isShowListFlag ? 'animated slideInLeft' : 'hidden'"
      :leave-active-class="isShowListFlag ? '' : 'animated slideOutLeft'"
    >
      <div
        class="main-button"
        v-if="!isShowListFlag"
        @click="changeIsShowListFlag()"
      >
        <el-icon size="30" color="#ffffffe3" class="expand" :style="{color:color}">
          <Expand />
        </el-icon>
      </div>
      <!-- 已阻止点击冒泡,所以只有点击没有事件的模块才能关闭 -->
      <div class="main-list" v-else @click="changeIsShowListFlag(false)">
        <div class="main-list-head">
          <div class="main-list-head-title">
            <span>整体项目</span>
            <a href="https://github.com/WaterWhiteEgg?tab=repositories">
              <el-icon>
                <Link />
              </el-icon>
            </a>
            <span class="main-list-head-title-user" @click="toUser">{{
              JSON.parse(useRegister().userData).username + ">"
            }}</span>
          </div>
        </div>
        <div class="main-list-body">
          <!-- 搜索栏 -->
          <indexSearch></indexSearch>
          <!-- 列表栏 -->
          <indexList @clickList="changeIsShowListFlag(false)"></indexList>
        </div>
      </div>
    </Transition>
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

.expand {
  color: #cdcdcd;
}

.main {
  position: absolute;
  z-index: 999999;
}

.main-button {
  position: absolute;
  width: 30px;
  cursor: pointer;
}

.main-list {
  position: absolute;
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
  width: 100%;
}

.main-list-head-title {
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 1vh 0 0 0.5vw;
  width: 100%;
  white-space: nowrap;
}

.main-list-head-title a {
  display: flex;
  padding-right: 0.5vw;
}

.main-list-head-title-user {
  margin-right: 1vw;
  margin-left: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.8rem;
  color: #5a5a5a;
}

.main-list-body {
  margin: 0 1vw;
}

@media screen and (max-width: 969px) {
  /* 手机 */
  /* 类平板 */

  .expand {
    color: #ffffff;
  }
  .main {
    position: relative;
    z-index: 99;
    background-color: #beedffe0;
  }

  .main-button {
    position: relative;
    height: 30px;
  }

  .main-list {
    position: absolute;
    margin: 0;
    width: 100vw;
    height: 100vh;
    overflow: scroll;
    background-color: #ffffff;
  }
  .main-list-head {
    background-color: #beedffe0;
  }

  .main-list-head-title-user {
    margin-right: 2vw;
    font-size: 1rem;
  }
}
</style>
