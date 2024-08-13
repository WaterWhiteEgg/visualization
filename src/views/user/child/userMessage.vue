<script setup lang="ts">
import { computed, ref } from "vue";
import { type UserData } from "@/network/user";
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
</script>
<template>
  <div class="user_message">
    <div class="user_message_descs">
      简介:
      {{ userData.descs ? userData.descs : "这个人很懒，没有填写简介喔~" }}
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
  .user_message_descs{
    border: 0;
    border-bottom:1px solid #75757586 ;
  }
}
</style>
