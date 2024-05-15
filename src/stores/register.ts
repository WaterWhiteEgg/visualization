import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

export const useRegister = defineStore(
  "register",
  (): {
    registerData: Ref<string>;
    changeRegisterData: (str: string) => void;
    userAgent: Ref<string>;
    changeUserAgent: (str: string) => void;
  } => {
    // 用户注册时的数据
    const registerData = ref("{}");
    // 用户浏览器等信息
    const userAgent = ref("{}");
    function changeUserAgent(str: string) {
      userAgent.value = str;
    }

    // 切换registerData数据
    function changeRegisterData(str: string) {
      registerData.value = str;
    }

    return {
      registerData,
      changeRegisterData,
      userAgent,
      changeUserAgent,
    };
  }
);
