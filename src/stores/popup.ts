import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import { ref, type Ref } from "vue";

export const usePopup = defineStore(
  "popup",
  (): {
    openPopup: typeof openPopup;
    isThrottleCloseButton: Ref<boolean>;
    throttleCount: Ref<number>;
    isOpenMainviewIndex: Ref<boolean>;
    changeisOpenMainviewIndex: typeof changeisOpenMainviewIndex;
  } => {
    // 弹出框
    function openPopup(
      message: string,
      type: "success" | "warning" | "info" | "error" = "warning"
    ) {
      ElMessage({
        message,
        type,
      });
    }
    // 节流阀布尔值
    const isThrottleCloseButton = ref(false);
    // 节流阀计数值
    const throttleCount = ref(0);

    // 控制mainviewIndex的弹窗
    const isOpenMainviewIndex = ref(true);

    function changeisOpenMainviewIndex(bol: boolean) {
      isOpenMainviewIndex.value = bol;
    }

    return {
      openPopup,
      isThrottleCloseButton,
      throttleCount,
      isOpenMainviewIndex,
      changeisOpenMainviewIndex,
    };
  }
);
