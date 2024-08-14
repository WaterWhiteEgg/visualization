<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { changeDescs, type UserData } from "@/network/user";
import { usePopup } from "@/stores/popup";

const props = withDefaults(
  defineProps<{
    userData: UserData;
    isShowMainUserFlag: boolean;
  }>(),
  {
    userData: undefined,
    isShowMainUserFlag: false,
  }
);
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();

// 性别判断
const gender = computed(() => {
  switch ((props.userData as UserData).gender) {
    case 0:
      return "男";
    case 1:
      return "女";
    case 2:
      return "武装直升机";
    default:
      return "未填写";
  }
});

// 简介弹窗布尔值
const dialogVisibleDescs = ref(false);
// 简介储存的值
const inDescs = ref("");

watch(
  () => props.userData.descs,
  (newDesc: string) => {
    inDescs.value = newDesc;
  },
  { immediate: true } // 立即调用一次，确保初始值也被处理
);

// 切换简介值
const inChangeDescs = () => {
  changeDescs(inDescs.value, props.userData.user_id)
    .then((res) => {
      usePopup().openPopup("切换成功", "success");
      // 关闭界面
      dialogVisibleDescs.value = false;
    })
    .catch((err) => {
      usePopup().openPopup("切换失败", "error");
    });
};
</script>
<template>
  <div class="user_message">
    <div class="user_message_descs" @click="dialogVisibleDescs = true">
      简介:
      {{ inDescs !== "" ? inDescs : "这个人很懒，没有填写简介喔~" }}

      <el-dialog
        v-model="dialogVisibleDescs"
        title="更换简介"
        width="90vw"
        draggable
      >
        <textarea
          type="text"
          v-model="inDescs"
          class="user_message_descs_textarea"
        ></textarea>
        <el-button type="success" @click="inChangeDescs">确定</el-button>
      </el-dialog>
    </div>
    <div class="user_message_useradmin">
      <div>
        用户名:
        {{ userData.username }}
      </div>
      <div>
        用户id:
        {{ userData.user_id }}
      </div>
      <div>
        性别:
        {{ gender }}
      </div>
      <div v-if="isShowMainUserFlag">
        邮箱:
        {{ userData.email ? userData.email : "未填写" }}
      </div>
      <div v-if="isShowMainUserFlag">
        手机号码:
        {{ userData.phone_number ? userData.phone_number : "未填写" }}
      </div>

      <div v-if="isShowMainUserFlag">
        管理员认证:
        {{ userData.is_admin ? "管理员" : "非管理员" }}
      </div>
      <div v-if="isShowMainUserFlag">
        游客登录:
        {{ userData.is_guest ? "游客登录" : "否" }}
      </div>
      <div>
        注册时间:
        {{ userData.registration_time }}
      </div>
    </div>
  </div>
</template>
<style scoped>
.user_message {
  width: 80vw;
  margin: 0 auto;
  font-size: 0.8rem;

  background-color: #fff;
}
.user_message_descs {
  height: 10vh;
  min-height: 30px;
  max-height: 100px;
  padding: 0.5vh 0.5vw;
  overflow: scroll;
  color: #5f5f5f;
  border: 1px solid #e7e7e7;
}
/* 隐藏滚动条，兼容 Chrome 和 Firefox */
.user_message_descs {
  scrollbar-width: none; /* Firefox */
}

.user_message_descs::-webkit-scrollbar {
  display: none; /* Chrome */
}
.user_message_descs_textarea {
  width: 80vw;
  height: 40vh;
  resize: none;
  font-size: 1.2rem;
}

.user_message_useradmin {
  display: flex;
  flex-wrap: wrap;
}
.user_message_useradmin div {
  box-sizing: border-box;
  width: 50%;
  padding: 1vh 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 969px) {
  /* 手机 */
  /* 类平板 */
  .user_message_descs {
    border: 0;
    border-bottom: 1px solid #75757586;
  }
}
</style>
