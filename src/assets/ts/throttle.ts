
import {usePopup}  from "@/stores/popup"
// 最好在stores里解决定时减数
// 实现节流阀的效果，同时配合全局状态管理实现计时倒数
export const startCountdown = () => {
    isButtonDisabled.value = true;
    countdown.value = 60;

    const interval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(interval);
        isButtonDisabled.value = false;
      }
    }, 1000);
  };