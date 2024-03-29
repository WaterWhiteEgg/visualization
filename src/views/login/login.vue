<template>
  <el-form
    ref="ruleFormRef"
    style="
      position: absolute;
      top: 50%; /* 将元素顶部定位到父容器中间位置 */
      left: 50%; /* 将元素左侧定位到父容器中间位置 */
      transform: translate(
        -50%,
        -50%
      ); /* 利用transform平移来使元素完全垂直居中 */
      margin: 20px; /* 外边距 */
    "
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="用户名" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <!-- 密码 -->
    <el-form-item label="密码" style="position: relative;" prop="password">
      <el-input
        :type="isShowPassWord == false ? 'password' : 'text'"
        v-model="ruleForm.password"
        placeholder="输入新密码"
        autocomplete="off"
      >
      </el-input>
      <el-icon
        :size="20"
        style="position: absolute;right:5px;"
        :color="'#8299ff'"
        @click="isShowPassWord = !isShowPassWord"
      >
        <Open  v-if="isShowPassWord"/>
        <TurnOff  v-else />
      </el-icon>
    </el-form-item>

    <el-form-item label="性别" prop="region">
      <el-select v-model="ruleForm.region" placeholder="选择你的性别">
        <el-option label="男" value="male" />
        <el-option label="女" value="female" />
        <el-option label="武装直升机" value="unknown" />
      </el-select>
    </el-form-item>

    <el-form-item label="记住我的账户" prop="resource">
      <el-radio-group v-model="ruleForm.resource">
        <el-radio value="1">确实</el-radio>
        <el-radio value="0">不要</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="简介" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        创建/登录
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";

interface RuleForm {
  name: string;
  region: string;
  password: string;
  date1: string;
  date2: string;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}

const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  region: "",
  password: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "1",
  desc: "",
});

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "请输入账户名", trigger: "blur" },
    { min: 3, max: 5, message: "请输入正确的账户名", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 3, max: 12, message: "请输入正确的密码", trigger: "blur" },
  ],
  region: [
    {
      required: true,
      message: "",
      trigger: "change",
    },
  ],

  date1: [
    {
      type: "date",
      required: true,
      message: "Please pick a date",
      trigger: "change",
    },
  ],
  date2: [
    {
      type: "date",
      required: true,
      message: "Please pick a time",
      trigger: "change",
    },
  ],
  type: [
    {
      type: "array",
      required: true,
      message: "Please select at least one activity type",
      trigger: "change",
    },
  ],
  resource: [
    {
      required: true,
      message: "Please select activity resource",
      trigger: "change",
    },
  ],
  desc: [
    { required: false, message: "填写你的简介", trigger: "blur" },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));

// 显示隐藏密码
const isShowPassWord = ref(false);
</script>
