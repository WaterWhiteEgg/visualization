<script lang="ts" setup>
import { debounce } from "@/assets/ts/debounce";
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { useRegister } from "../../stores/register";
import { useToken } from "../../stores/token";
import { usePopup } from "../../stores/popup";
import { commitUser, findJestOneEmail } from "../../network/db";
import { postToFindEmailCode } from "../../network/redis";
import {
  inPostToGetEmailCode,
  waitEmailCodeClick,
} from "../../assets/ts/codePost";
import { inFindUsername } from "@/assets/ts/user/inFindUsername";

const registerData = ref<{
  name: string;
  password: string;
  resource: string;
}>({ name: "", password: "", resource: "" });

interface RuleForm {
  name: string;
  againPassword: string;
  email: string;
  validate: string;
  emailCode: string;
  phone: null | string;
  phoneCode: null | string;
  region: string;
  desc: string;
}
// router实例
const router = useRouter();

// 获得注册前的json数据
onMounted(() => {
  registerData.value = JSON.parse(useRegister().registerData);
  // 没有数据则跳转
  if (Object.keys(registerData.value).length === 0) {
    usePopup().openPopup("未填写数据");
    router.push("/login");
  }
  // 有数据就赋值
  else {
    // 将之前获取的name更新到这里的表单
    ruleForm.name = registerData.value.name;
  }
});

// 页面加载flag
const isStartFormLoading = ref(false);
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
  emailCode: "",
  phone: "",
  phoneCode: "",
  region: "0",
  desc: "",
});

// 再次判断密码
const findAgainPassword = (
  rule: unknown,
  value: unknown,
  callback: (Error?: Error) => void
) => {
  // 判断密码是否重复
  if (registerData.value.password !== ruleForm.againPassword) {
    callback(new Error("与上一个密码不相符"));
  } else {
    callback();
  }
};
// 寻找用户名实例
// 用户名验证规则实例
const usernameRules = inFindUsername(ruleForm);

// 验证邮箱是否唯一
const emailRules = async (
  rule: unknown,
  value: unknown,
  callback: (Error?: Error) => void
) => {
  // 防抖处理
  let res = debounce(async () => {
    try {
      // 请求搜寻邮箱唯一
      let postToFindEmailCodeRes = await findJestOneEmail({
        email: ruleForm.email,
      });
      // 可能出现的状态码是200但验证失败
      if (postToFindEmailCodeRes.data.status) {
        callback(new Error("邮箱已经存在"));
      } else {
        callback();
      }
      // 验证失败处理
    } catch (error) {
      callback(new Error("邮箱已存在或网络错误"));
    }
  });
  // 网络请求
  await res();
  // console.log(findUsernameRes);
};

// 验证邮箱验证码
const findEmailCode = async (
  rule: unknown,
  value: unknown,
  callback: (Error?: Error) => void
) => {
  // 防抖处理
  let res = debounce(async () => {
    ;
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

// 表单
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
  againPassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      pattern:
        /^(?=.*[0-9])(?=.*[a-zA-Z])[\da-zA-Z!@#$%^&*()+=\\[\]{}|:;"'<>,.?/]{6,18}$/,
      message: "请输入6-18位数字或字母，不能有空格",
      trigger: "blur",
    },
    // 自定义校验规则
    {
      validator: findAgainPassword as unknown as (
        rule: unknown,
        value: unknown,
        callback: (error?: string | Error) => void,
        source: unknown,
        options: unknown
      ) => void,
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
    // 自定义校验规则
    {
      validator: emailRules as unknown as (
        rule: unknown,
        value: unknown,
        callback: (error?: string | Error) => void,
        source: unknown,
        options: unknown
      ) => void,
      trigger: "blur",
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
  desc: [{ required: false, message: "填写你的简介", trigger: "blur" }],
});

// 注册提交，这个会验证规则
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 验证通过提交，整合所有需要提交的数据
      const mergedForm = {
        ...registerData.value,
        ...ruleForm,
        ...{ user_agent: useRegister().userAgent },
      };
      commitUser(mergedForm)
        .then((res) => {
          console.log(res);

          // 更新记录token
          useToken().changeToken(res.data.token);
          // 弹窗提示
          usePopup().openPopup("注册成功", "success");
          // 跳转页面
          router.replace("/");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // 规则错误
    else {
      console.log("error submit!", fields);
    }
  });
};

// 重置登录状态
const resetForm = () => {
  // 表单数据 formEl: FormInstance | undefined
  useRegister().changeRegisterData("");
  router.push("/login");
};

// 获取邮箱验证码
const getEmailCode = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    // 邮箱地址不能有错,如果存在错误处理
    console.log(valid);
    
    if (fields && fields.email && fields.email.length > 0) {
      usePopup().openPopup("邮箱错误", "error");
    }
    // 验证成功
    else {
      // 网络请求
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
    status-icon
    v-loading="isStartFormLoading"
  >
    <h3>注册</h3>
    <el-form-item label="用户名" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <!-- 密码 -->
    <el-form-item
      label="再次密码"
      style="position: relative"
      prop="againPassword"
    >
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
    <div v-if="ruleForm.validate === '邮箱验证'">
      <el-form-item label="邮箱" prop="email" class="email">
        <el-input v-model="ruleForm.email" class="email_input" />

        <el-form-item
          label="邮箱验证码"
          prop="emailCode"
          class="formitem email_code"
        >
          <el-input v-model="ruleForm.emailCode" class="code_input" />
          <div
            class="code_input_button"
            @click="getEmailCode(ruleFormRef)"
            v-if="waitEmailCodeClick === 0"
          >
            获取验证码
          </div>
          <div class="code_input_button" v-else>
            等待{{ waitEmailCodeClick }}秒
          </div>
        </el-form-item>
      </el-form-item>
    </div>

    <div v-if="ruleForm.validate === '手机认证'">
      <el-form-item label="手机号码" prop="phone" class="phone">
        <el-input v-model="ruleForm.phone" />
        <el-form-item label="手机验证码" prop="phoneCode" class="formitem">
          <el-input v-model="ruleForm.phoneCode" class="code_input" />
          <button class="code_input_button">获取验证码</button>
        </el-form-item>
      </el-form-item>
    </div>

    <el-form-item label="性别" prop="region">
      <el-select v-model="ruleForm.region" placeholder="选择你的性别">
        <el-option label="男" value="0" />
        <el-option label="女" value="1" />
        <el-option label="武装直升机" value="2" />
      </el-select>
    </el-form-item>

    <el-form-item label="简介" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        创建
      </el-button>
      <el-button @click="resetForm()">重新填写</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
/* 深度查找改变颜色 */
:deep().phone .el-form-item__error {
  color: rgb(0, 0, 0);
  background-color: #fff;
}

:deep() .el-form-item__error {
  background-color: #fff;
}

.formitem {
  margin-top: 1vh;
  font-size: 0.1rem;
  margin-left: auto; /* 在主轴方向上靠右对齐 */
}

.form {
  position: absolute;
  top: 50%;
  /* 将元素顶部定位到父容器中间位置 */
  left: 50%;
  /* 将元素左侧定位到父容器中间位置 */
  padding: 20px;
  /* 外边距 */

  transform: translate(-50%, -50%);
  /* 利用transform平移来使元素完全垂直居中 */
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
  opacity: 0.4;
  /* 调整这里的值来设置透明度 */
  z-index: -1;
}

.email_code {
  display: flex;
}
.code_input {
  width: 15vw;
}
.code_input_button {
  font-size: 0.8rem;
  margin: 0.5vw;
  padding: 0 1vw;
  cursor: pointer;
}

@media screen and (max-width: 969px) {
  /* 手机 */
  /* 类平板 */
  .form {
    position: relative;
    top: 0;
    /* 将元素顶部定位到父容器中间位置 */
    left: 0;
    /* 将元素左侧定位到父容器中间位置 */
    padding: 20px;
    /* 外边距 */

    transform: translate(0, 0);
    /* 利用transform平移来使元素完全垂直居中 */
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
    opacity: 0.4;
    /* 调整这里的值来设置透明度 */
    z-index: -1;
  }
}
</style>
