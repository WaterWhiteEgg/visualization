<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const emits = defineEmits<{
  (e: "clickList"): void;
}>();
// 实例路由
const router = useRouter();
import listLeft from "./list/listLeft.vue";
// 列表活跃index
const activeName = ref("1");
// 切换路由并发送emit
const toRouter = (str: string) => {
  router.push(str);

  // 发送点击完毕请求
  emits("clickList");
};
</script>

<template>
  <div class="collapse" @click.stop>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="用户管理" name="1">
        <listLeft @click="toRouter('/login')" borderBottom="0.5px solid #3300ff">
          <template #title >
            登录/注册
          </template>
        </listLeft>
        <div>
          <div class="collapse-item-desc">
            登录后会保存你的数据，同时才能开放一些功能的使用。
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="项目管理" name="2">
        <div>目前想要储存一些简单的数据并进行增删改查</div>
      </el-collapse-item>
      <el-collapse-item title="记录" name="3">
        希望储存用户的操作以及一些数据的展示
      </el-collapse-item>
      <el-collapse-item title="操作" name="4">
        <div>
          <listLeft @click="toRouter('/')">
            <template #title> 返回主页</template>
          </listLeft>
          <listLeft @click="toRouter('/system')">
            <template #title>设置</template>
          </listLeft>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.collapse-item-desc {
  color: #9d9d9d;
}
</style>
