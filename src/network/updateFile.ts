// 上传文件
import { postRequest } from "./index";

// 上传头像
export const commitAvater = (fromData) => {
  return postRequest({
    headers: { "Content-Type": "multipart/form-data" },
    url: "/public/avatar",

    data: fromData,
  });
};
