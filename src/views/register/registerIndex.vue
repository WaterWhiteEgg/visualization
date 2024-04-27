<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { commitUser } from "../../network/db";
import {useRegister} from "../../stores/register"

interface RuleForm {
  name: string;
  againPassword: string;
  email: string;
  validate: string;
}

// 配置表单大小
const formSize = ref("default");
// 表单数据
const ruleFormRef = ref<FormInstance>();
// 表单默认值
const ruleForm = reactive<RuleForm>({
  name: "",
  againPassword: "",
  email: "",
  validate: "邮箱验证",
});
// 表单规则
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "请输入账户名", trigger: "blur" },
    {
      min: 3,
      max: 12,
      pattern: /^[^\s~!@#$%^&*()_+`\-={}[\]:;"'<>,.?/]+$/,
      message: "请输入正确的账户名",
      trigger: "blur",
    },
  ],
  againPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 18,
      pattern: /^[a-zA-Z0-9]+$/,
      message: "请输入6-18且的只能是数字或字母的密码",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
    // 集成的邮箱验证规则
      type: "email",
      message: "请输入格式正确的邮箱",
      trigger: ["blur", "change"],
    },
  ],
});

// 注册提交，这个会验证规则
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 验证登录，若没有该账户则跳转注册
      console.log(JSON.stringify(ruleForm));
    }
    // 规则错误
    else {
      console.log("error submit!", fields);
    }
  });
};
// 游客登录
const submitGuestForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      commitUser(ruleForm).then((res) => {
        console.log(res);
      });
    }
    // 错误提示
    else {
      console.log("error submit!", fields);
    }
  });
};

// 重置输入
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
    {{ useRegister().registerData }}
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="form"
    :size="formSize"
    status-icon
  >
    <h3>注册</h3>
    <el-form-item label="用户名" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <!-- 密码 -->
    <el-form-item label="密码" style="position: relative" prop="againPassword">
      <el-input
        type="password"
        v-model="ruleForm.againPassword"
        placeholder="再次输入新密码"
        show-password
      >
      </el-input>
    </el-form-item>
    <el-form-item label="验证方式">
      <el-select v-model="ruleForm.validate" placeholder="选择验证方式">
        <el-option label="邮箱验证" value="邮箱验证" />
        <el-option label="手机认证" value="手机认证" />
      </el-select>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="ruleForm.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        创建
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.form {
  position: absolute;
  top: 50%; /* 将元素顶部定位到父容器中间位置 */
  left: 50%; /* 将元素左侧定位到父容器中间位置 */
  padding: 20px; /* 外边距 */

  transform: translate(-50%, -50%); /* 利用transform平移来使元素完全垂直居中 */
  border-radius: 10px;

  background-color: rgba(255, 255, 255, 0.5);

  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
}

.form::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("https://source.unsplash.com/random") no-repeat center center /
    cover;
  opacity: 0.4; /* 调整这里的值来设置透明度 */
  z-index: -1;
}

@media screen and (max-width: 969px) {
  /* 手机 */
  /* 类平板 */
  .form {
    position: relative;
    top: 0; /* 将元素顶部定位到父容器中间位置 */
    left: 0; /* 将元素左侧定位到父容器中间位置 */
    padding: 20px; /* 外边距 */

    transform: translate(0, 0); /* 利用transform平移来使元素完全垂直居中 */
    border-radius: 0px;
    background-color: rgba(255, 255, 255, 0.5);
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  .form::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("https://source.unsplash.com/random") no-repeat center
      center / cover;
    opacity: 0.4; /* 调整这里的值来设置透明度 */
    z-index: -1;
  }
}
</style>