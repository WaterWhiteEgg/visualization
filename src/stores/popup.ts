import { defineStore } from "pinia";
import { ElMessage } from "element-plus";

export const usePopup = defineStore(
  "popup",
  (): { openPopup: typeof openPopup } => {
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

    return { openPopup };
  }
);
