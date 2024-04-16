import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

export const useToken = defineStore(
  "token",
  (): {
    token: Ref<string>;
    changeToken: (str: string) => void;
  } => {
    const token = ref("1");
    function changeToken(str: string) {
      token.value = str;
    }
    return { token, changeToken };
  },
  {
    persist: true,
  }
);
