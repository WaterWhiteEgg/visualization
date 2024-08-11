import { debounce } from "@/assets/ts/debounce";
import { reactive, ref, onMounted } from "vue";
import { findUsername } from "@/network/db";
// 寻找用户名规则

export const inFindUsername = (ruleForm: { name: string }) => {
  return async function (
    rule: unknown,
    value: unknown,
    callback: (Error?: Error) => void
  ) {
    const findUsernameForm = {
      ...ruleForm,
    };
    let res = debounce(async () => {
      // 进行网络请求
      try {
        console.log(findUsernameForm);

        let findUsernameRes = await findUsername(findUsernameForm);
        if (findUsernameRes.data.status) {
          callback(new Error(findUsernameRes.data.message));
        } else {
          callback();
        }
      } catch (error) {
        console.log(error);

        callback(new Error("验证出现问题"));
      }
    });
    // 网络请求
    await res();
    // console.log(findUsernameRes);
  };
};
