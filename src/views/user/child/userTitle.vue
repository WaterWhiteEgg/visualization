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
  <div class="user_title">
    <div class="user_title_avatar">
      <img
        :src="userData.avatar_url"
        :title="userData.avatar_url"
      />
    </div>
    <div class="user_title_name">{{ userData.username }}</div>
  </div>
</template>
<style scoped>
.user_title {
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100vw;
  height: 20vh;
  background-image: linear-gradient(-90deg, #29bdd9 0%, #276ace 100%);
}
.user_title_avatar {
  height: 15vh;
  width: 15vh;
  margin-right: 2%;
  margin-bottom: 1%;
  border-radius: 50%;
  overflow: hidden;
}
.user_title_avatar img {
  height: 100%;
  width: 100%;
}
.user_title_name {
  font-size: 2rem;
}
</style>
