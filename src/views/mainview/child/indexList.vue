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
        <listLeft @click="toRouter('/login')">
          <template #title
            >登录/注册 <span style="color: red"> (*beta)</span></template
          >
        </listLeft>
        <div>
          <div class="collapse-item-desc">
            登录后会保存你的数据，同时才能开放一些功能的使用。
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="项目管理" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects;
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging
          elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item title="记录" name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive;
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the
          users can quickly understand and make decisions;
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps
          the users to identify and frees them from memorizing and recalling.
        </div>
      </el-collapse-item>
      <el-collapse-item title="其他" name="4">
        <div>
          Decision making: giving advices about operations is acceptable, but do
          not make decisions for the users;
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to
          operate, including canceling, aborting or terminating current
          operation.
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
