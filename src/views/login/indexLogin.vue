<script lang="ts" setup>
import { reactive, ref, onMounted, type Ref } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { loginUser, findUsername } from "../../network/db";
import { useRegister } from "../../stores/register";
import { usePopup } from "../../stores/popup";
import { useToken } from "../../stores/token";
import { debounce } from "@/assets/ts/debounce";
import { type AxiosResponse } from "axios";

import { postToFindEmailCode } from "../../network/redis";

import {
  inPostToGetEmailCode,
  waitEmailCodeClick,
} from "../../assets/ts/codePost";

interface RuleForm {
  name: string;
  password: string;
  resource: string;
  validate: string;
  email: string;
  emailCode: string;
  phone: string;
  phoneCode: string;
}
// 使用webapi获取用户数据
const userAgent: Ref<string> = ref("");
onMounted(() => {
  userAgent.value = navigator.userAgent;
  // 全局保存
  useRegister().changeUserAgent(JSON.stringify({ userAgent: userAgent.value }));
});

// router实例
const router = useRouter();
// 表单加载动画flag
const isStartFormLoading = ref(false);
// 配置表单大小
const formSize = ref("default");
// 表单数据
const ruleFormRef = ref<FormInstance>();
// 表单默认值
const ruleForm = reactive<RuleForm>({
  name: "",
  password: "",
  resource: "1",
  validate: "用户名登录",
  email: "",
  emailCode: "",
  phone: "",
  phoneCode: "",
});

// 验证邮箱验证码
const findEmailCode = async (
  rule: unknown,
  value: unknown,
  callback: (Error?: Error) => void
) => {
  // 防抖处理
  let res = debounce(async () => {
    try {
      // 请求postToFindEmailCode，获取res，若有问题catch捕捉
      let postToFindEmailCodeRes = await postToFindEmailCode(
        ruleForm.email,
        ruleForm.emailCode
      );
      // 可能出现的状态码是200但验证失败
      if (postToFindEmailCodeRes.data.status) {
        callback(new Error("验证码验证错误"));
      } else {
        callback();
      }
      // 验证失败处理
    } catch (error) {
      callback(new Error("验证码验证错误"));
    }
  });
  // 网络请求
  await res();
  // console.log(findUsernameRes);
};

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
      trigger: ["blur"],
    },
    {
      pattern: /^[\w-.]+@(qq|163|gmail)\.com$/,
      message: "请输入格式支持的邮箱，如qq，163，gmail.com",
      trigger: ["blur"],
    },
  ],
  emailCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur",
    },
    {
      pattern: /^[a-zA-Z0-9]{8}$/,
      message: "请输入格式正确的邮箱验证码",
      trigger: ["blur"],
    },

    // 自定义校验规则
    {
      validator: findEmailCode as unknown as (
        rule: unknown,
        value: unknown,
        callback: (error?: string | Error) => void,
        source: unknown,
        options: unknown
      ) => void,
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号码（+86)",
      trigger: "blur",
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入格式正确的手机号码格式",
      trigger: ["blur", "change"],
    },
  ],
  phoneCode: [
    {
      required: true,
      message: "请输入手机验证码",
      trigger: "blur",
    },
    {
      pattern: /^\d{6}$/,
      message: "请输入格式正确的手机验证码",
      trigger: ["blur", "change"],
    },
  ],
});

// 注册或创建提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      // 验证登录，若没有该账户则跳转注册
      const loginForm = {
        ...ruleForm,
      };
      findUsername(loginForm).then((res) => {
        // console.log(res.data.status);
        // 假设没有用户则跳转注册
        if (!res.data.status) {
          // 记录数据后跳转注册
          useRegister().changeRegisterData(JSON.stringify(ruleForm));
          router.push({
            path: "/register",
          });
        }
        // 否则处理开始登录
        else {
          justSubmitForm(ruleFormRef.value);
        }
      });
    }
    // 规则错误
    else {
      console.log("error submit!", fields);
    }
  });
};
// 注册提交，会再次再次验证表单
const justSubmitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      // 验证登录，若没有该账户则跳转注册
      // 测试登录
      const loginForm = {
        ...ruleForm,
        ...{ user_agent: useRegister().userAgent },
      };
      loginUser(loginForm).then(
        (
          res: AxiosResponse<{
            token?: string;
            status: 0 | 1;
            error?: { status: number; message: string };
          }>
        ) => {
          // 根据status返回的结果决定登录状态,1就是失败了
          console.log(res);

          if (res.data.status) {
            // 提示登录失败
            usePopup().openPopup(res.data.error!.message, "error");
          }
          // 登录成功
          else {
            // 记录token
            // console.log(res.data.token);

            useToken().changeToken(res.data.token as string);

            // 提示登录成功
            usePopup().openPopup("登录成功", "success");
            // 跳转路由
            router.replace("/");
          }
        }
      );
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
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // commitUser(ruleForm).then((res) => {
      //   console.log(res);
      // });
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

// 获取邮箱验证码
const getEmailCode = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    console.log(fields);
    // 邮箱地址不能有错,如果存在错误处理
    if (fields && fields.email && fields.email.length > 0) {
      usePopup().openPopup("未填写邮箱", "error");
    }
    // 验证成功
    else {
      // 网络请求
      // 节流阀，延迟后执行
      // 开启加载动画
      isStartFormLoading.value = true;
      // 节流阀，延迟后执行
      inPostToGetEmailCode(ruleForm.email).finally(() => {
        // 关闭加载动画
        isStartFormLoading.value = false;
      });
    }
  });
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
    v-loading="isStartFormLoading"
    status-icon
  >
    <h3>{{ ruleForm.validate === "用户名登录" ? "登录/注册" : "登录" }}</h3>
    <el-form-item label="验证方式">
      <el-select v-model="ruleForm.validate" placeholder="选择验证方式">
        <el-option label="邮箱登录" value="邮箱登录" />
        <el-option label="手机登录" value="手机登录" />
        <el-option label="用户名登录" value="用户名登录" />
      </el-select>
    </el-form-item>

    <div v-if="ruleForm.validate === '用户名登录'">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="ruleForm.name" placeholder="输入用户名/用户id" />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" style="position: relative" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          placeholder="输入密码"
          show-password
        >
        </el-input>
      </el-form-item>
    </div>

    <div v-if="ruleForm.validate === '手机登录'">
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="验证码" style="position: relative" prop="phoneCode">
        <el-input
          type="password"
          v-model="ruleForm.phoneCode"
          placeholder="输入验证码"
          show-password
        >
        </el-input>
        <div class="code_input_button">获取验证码</div>
      </el-form-item>
    </div>

    <div v-if="ruleForm.validate === '邮箱登录'">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="验证码" style="position: relative" prop="emailCode">
        <el-input
          type="password"
          v-model="ruleForm.emailCode"
          placeholder="输入验证码"
          show-password
        >
        </el-input>
        <div
          class="code_input_button"
          v-if="waitEmailCodeClick === 0"
          @click="getEmailCode(ruleFormRef)"
        >
          获取验证码
        </div>
        <div class="code_input_button" v-else>
          等待{{ waitEmailCodeClick }}秒
        </div>
      </el-form-item>
    </div>

    <el-form-item label="记住我的账户" prop="resource">
      <el-radio-group v-model="ruleForm.resource">
        <el-radio value="1">确实</el-radio>
        <el-radio value="0">不要</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <!-- 登录分为直接验证登录，和验证后跳转注册的情况 -->

      <el-popover
        placement="bottom"
        :width="200"
        trigger="hover"
        content="进行登录提交，创建/登录 会在没有相对应账户时跳转注册界面。"
      >
        <template #reference>
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef)"
            v-if="ruleForm.validate === '用户名登录'"
          >
            创建/登录
          </el-button>
          <el-button type="primary" @click="justSubmitForm(ruleFormRef)" v-else>
            登录
          </el-button>
        </template>
      </el-popover>

      <el-popover
        placement="bottom"
        :width="200"
        trigger="hover"
        content="游客登录会尝试直接注册一个账号，不会绑定验证，功能可能会受限。"
      >
        <template #reference>
          <el-button
            type="primary"
            color="#707070"
            @click="submitGuestForm(ruleFormRef)"
            v-if="ruleForm.validate === '用户名登录'"
          >
            游客登录
          </el-button>
        </template>
      </el-popover>

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
  background: url("https://t.mwm.moe/pc") no-repeat center center / cover;
  opacity: 0.4; /* 调整这里的值来设置透明度 */
  z-index: -1;
}

.code_input_button {
  margin: 1vh 0;
  padding: 0.25vh 1vw;
  border: 0.5px solid #e5e5e5;
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
    opacity: 0.4; /* 调整这里的值来设置透明度 */
    z-index: -1;
  }
}
</style>
