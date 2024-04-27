import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

export const useRegister = defineStore(
  "register",
  (): {
    registerData: Ref<string>;
    changeRegisterData: (str: string) => void;
  } => {
    const registerData = ref("");
    function changeRegisterData(str: string) {
      registerData.value = str;
    }
    return { registerData, changeRegisterData };
  }
);
