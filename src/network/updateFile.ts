// 上传文件
import { postRequest } from "./index";

import { type UploadRawFile } from "element-plus";
// 上传头像
export const commitAvater = (fromData: UploadRawFile) => {
  return postRequest({
    url: "/public/avatar",

    data: fromData,
  });
};
