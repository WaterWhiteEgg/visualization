<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { commitUser } from "../../network/db";
import { useRegister } from "../../stores/register";

interface RuleForm {
  name: string;
  password: string;
  resource: string;
}
// router实例
const router = useRouter();
// 配置表单大小
const formSize = ref("default");
// 表单数据
const ruleFormRef = ref<FormInstance>();
// 表单默认值
const ruleForm = reactive<RuleForm>({
  name: "",
  password: "",
  resource: "1",
});
// 表单规则
const rules = reactive<FormRules<RuleForm>>({
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
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern:
        /^(?=.*[0-9])(?=.*[a-zA-Z])[\da-zA-Z!@#$%^&*()\-+=\\[\]{}|:;"'<>,.?/]{6,18}$/,
      message: "请输入6-18位数字或字母，不能有空格",
      trigger: "blur",
    },
  ],
});

// 注册提交，这个会验证规则
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      // 验证登录，若没有该账户则跳转注册

      // 跳转注册
      // 记录数据
      useRegister().changeRegisterData(JSON.stringify(ruleForm));
      router.push({
        path: "/register",
      });
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
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="form"
    :size="formSize"
    status-icon
  >
    <h3>登录/注册</h3>
    <el-form-item label="用户名" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <!-- 密码 -->
    <el-form-item label="密码" style="position: relative" prop="password">
      <el-input
        type="password"
        v-model="ruleForm.password"
        placeholder="输入新密码"
        show-password
      >
      </el-input>
    </el-form-item>

    <el-form-item label="记住我的账户" prop="resource">
      <el-radio-group v-model="ruleForm.resource">
        <el-radio value="1">确实</el-radio>
        <el-radio value="0">不要</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        创建/登录
      </el-button>
      <el-button
        type="primary"
        color="#707070"
        @click="submitGuestForm(ruleFormRef)"
      >
        游客登录
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
:deep() .el-form-item__error {
  background-color: #fff;
}
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
