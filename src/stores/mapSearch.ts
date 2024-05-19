// 搜索项目中的文字，状态等全局记录
import { ref, type Ref } from "vue";
import { defineStore } from "pinia";

export const useSearchItem = defineStore(
  "searchItem",
  (): {
    cityText: Ref<string>;
    changeCityText: (str: string) => void;
    isGetCitysFinally: Ref<boolean>;
    changeIsGetCitysFinally: (bool: boolean) => void;
    isErrorCityText: Ref<boolean>;
    changeIsErrorCityText: (bool: boolean) => void;
  } => {
    // 记录搜索栏文字
    const cityText = ref("");
    // 切换cityText
    function changeCityText(str: string) {
      cityText.value = str;
    }
    // 加载getCitys的flag
    const isGetCitysFinally = ref(true);
    // 切换isGetCitysFinally
    function changeIsGetCitysFinally(bool: boolean) {
      isGetCitysFinally.value = bool;
    }

    // 表示错误的输入的flag
    const isErrorCityText = ref(false);
    // 切换isErrorCityText
    function changeIsErrorCityText(bool: boolean) {
      isErrorCityText.value = bool;
    }
    return {
      cityText,
      changeCityText,
      isGetCitysFinally,
      changeIsGetCitysFinally,
      isErrorCityText,
      changeIsErrorCityText,
    };
  }
);
