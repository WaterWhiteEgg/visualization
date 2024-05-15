import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

export const useToken = defineStore(
  "token",
  (): {
    token: Ref<string>;
    changeToken: (str: string) => void;
    isDevelopmentMode: Ref<boolean>;
  } => {
    // 用户的token
    const token = ref("");
    // 切换用户token数据
    function changeToken(str: string) {
      token.value = str;
    }
    // 判断测试模式
    const isDevelopmentMode = ref(import.meta.env.MODE === "development");
    return { token, changeToken, isDevelopmentMode };
  },
  {
    persist: true,
  }
);
