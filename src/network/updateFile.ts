// 上传文件
import { postRequest } from "./index";

// 上传头像
export const commitAvater = (fromData: FormData) => {
  return postRequest({
    url: "/public/avatar",

    data: fromData,
  });
};
