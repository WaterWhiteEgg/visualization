import { usePopup } from "@/stores/popup";
// 实现节流阀的效果
let timer: number | null = null;
export function throttle(fn: Function, delay = 300) {
  
  if (timer === null) {
    timer = setTimeout(() => {
      fn();

      clearTimeout(timer as number);
      timer = null;
    }, delay);
  }
}
