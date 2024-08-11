<script setup lang="ts">
import { ref, reactive, type Ref } from "vue";

import type { FormInstance, FormRules } from "element-plus";
import { usePopup } from "@/stores/popup";
import { type UserData, changeUsername } from "@/network/user";
import { inFindUsername } from "@/assets/ts/user/inFindUsername";

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
const ruleForm = reactive({
  name: "",
});

// 表单ref
const ruleFormRef = ref<FormInstance>();

// 用户名验证规则实例
 const usernameRules = inFindUsername(ruleForm)
// 验证规则
const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    { required: true, message: "请输入账户名", trigger: "blur" },
    {
      pattern: /^[^\s~!@#$%^&*()_+`\-={}[\]:;"'<>,.?/]+$/,
      message: "存在特殊字符",
      trigger: "blur",
    },
    {
      pattern: /^\S{3,16}$/,
      message: "你只能在3-16的长度范围里命名",
      trigger: "blur",
    },
    {
      pattern: /^(?!w\d{5,}$).*$/,
      message: "请不要使用w+数字的格式命名你的名字",
      trigger: "blur",
    },
    // 自定义校验规则
    {
      validator: usernameRules as unknown as (
        rule: unknown,
        value: unknown,
        callback: (error?: string | Error) => void,
        source: unknown,
        options: unknown
      ) => void,
      trigger: "blur",
    },
  ],
});

// 提交用户名
const commitNewUsername = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      changeUsername(newUsername.value, props.userData.user_id).then((res) => {
        console.log(res);
      });
    } else {
      console.log("error submit!");
    }
  });
};
</script>
<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="itemusername"
  >
    <el-form-item label="用户名" prop="name">
      <el-input v-model="ruleForm.name" type="text" autocomplete="off" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="commitNewUsername(ruleFormRef)">
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
