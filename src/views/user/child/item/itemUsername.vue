<script setup lang="ts">
import { ref, toRefs, onMounted, onBeforeUnmount, type Ref } from "vue";
import { usePopup } from "@/stores/popup";
import { type UserData, changeUsername } from "@/network/user";

import type {
  UploadProps,
  UploadRequestOptions,
  UploadFile,
  UploadFiles,
  UploadRawFile,
  UploadUserFile,
} from "element-plus";
import { ElMessageBox } from "element-plus";
import { commitAvater } from "@/network/updateFile";
import { AxiosError } from "axios";

const props = withDefaults(
  defineProps<{
    userData: UserData;
  }>(),
  {
    userData: undefined,
  }
);

// 更新的名字
const newUsername = ref("");
// 提交新的名字
const commitNewUsername = () => {
  // 限制长度提交
  usePopup().openPopup("不符合用户名");
  changeUsername(newUsername.value, props.userData.user_id).then((res) => {
    console.log(res);
  });
};
</script>
<template>
  <el-input
    v-model="newUsername"
    style="width: 240px"
    maxlength="16"
    minlength="3"
    :placeholder="userData?.username"
    clearable
    show-word-limit
    type="text"
  />
  <el-button type="success" @click="commitNewUsername">提交</el-button>
</template>

<style scoped></style>
