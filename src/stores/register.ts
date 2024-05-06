import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

export const useRegister = defineStore(
  "register",
  (): {
    isDevelopmentMode: Ref<boolean>
    registerData: Ref<string>;
    changeRegisterData: (str: string) => void;
  } => {
    const registerData = ref("{}");
    const isDevelopmentMode = ref(import.meta.env.MODE === "development")
    function changeRegisterData(str: string) {
      registerData.value = str;
    }
    return { registerData, changeRegisterData, isDevelopmentMode };
  }
);
