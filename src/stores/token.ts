import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

export const useToken = defineStore(
  "token",
  (): {
    token: Ref<string>;
    changeToken: (str: string) => void;
  } => {
    // 用户的token
    const token = ref("");
    // 切换用户token数据
    function changeToken(str: string) {
      
      token.value = str;
    }

    return { token, changeToken };
  },
  {
    persist: true,
  }
);
