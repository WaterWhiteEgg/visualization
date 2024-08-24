import { usePopup } from "@/stores/popup";
import { postToGetEmailCode } from "@/network/redis";
import { throttle } from "@/assets/ts/throttle";
import { ref } from "vue";
// 处理验证码界面倒数以及弹窗提示
export const waitEmailCodeClick = ref(0);
const TimerAndPopupEmailCode = (status: 0 | 1) => {
  if (status) {
    // 有问题处理
    usePopup().openPopup("未发送完成", "error");
  }
  // 没有问题处理
  else {
    // 延迟点击
    // 初始化数据
    waitEmailCodeClick.value = 60;
    // 定时改变值
    const waitEmailCodeTimer = setInterval(() => {
      waitEmailCodeClick.value = --waitEmailCodeClick.value;
    }, 1000); // 每秒触发一次
    throttle(() => {
      // 停止计时，重置为0
      clearInterval(waitEmailCodeTimer);
      waitEmailCodeClick.value = 0;
    }, 60000);

    usePopup().openPopup("发送完成", "success");
  }
};

// 处理验证码请求
export async function inPostToGetEmailCode(email: string) {
  return postToGetEmailCode(email)
    .then((res) => {
      // 处理发送完成的状态
      TimerAndPopupEmailCode(res.data.status as 0 | 1);
    })
    .catch((err) => {
      console.log(err);
      usePopup().openPopup("验证码发送失败", "error");
    });
}
