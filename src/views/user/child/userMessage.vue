<script setup lang="ts">
import { ref } from "vue";
import { type UserData } from "@/network/user";
const props = withDefaults(
  defineProps<{
    userData: UserData | {};
  }>(),
  {
    userData: undefined,
  }
);
const emits = defineEmits<{
  (e: "emit", i: void): void;
}>();
</script>
<template>
  <div class="user_message">
    {{ userData }}
    <div class="user_message_descs">
      {{ userData.descs }}
    </div>

    <div class="user_message_useradmin">
      <div>
        用户名:
        {{ userData.username }}
      </div>
    </div>
    <div>
      用户id:
      {{ userData.user_id }}
    </div>
    <div>
      性别:
      {{ userData.gender }}
    </div>
    <div>
      邮箱:
      {{ userData.email }}
    </div>
    <div>
      手机号码:
      {{ userData.phone_number }}
    </div>
    <div>
      管理员认证:
      {{ userData.is_admin }}
    </div>
    <div>
      游客登录:
      {{ userData.is_guest }}
    </div>
    <div>
      注册时间:
      {{ userData.registration_time }}
    </div>
  </div>
</template>
<style scoped>
.user_message {
  width: 80vw;
  margin: 0 auto;
  background-color: #fff;
}
.user_item {
  width: 80vw;
  margin: 0 auto;
  background-color: #fff;
}
</style>
