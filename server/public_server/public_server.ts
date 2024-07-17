import express from "express";
import type { Router } from "express";
import { key } from "../realdata/key";
import { MYkey, isDEV, BASEURL } from "../key";
const publicRouter: Router = express.Router();

// 获取图片地址
publicRouter.get("/imgurl/:imgId", (req, res) => {
  const imgId = req.params.imgId; // 获取路由参数 :imgId 的值
  console.log(imgId);
  // 可以根据 imgId 找文件，找到对应的头像路径
  //   const imagePath = path.join(__dirname, `/public/img/avatar/${imgId}`);
  // 发送文件给客户端
  // res.sendFile(imagePath);
});
// 获取头像id
export function imgId(id: string = "default.jpg") {
  const [baseUrl] = BASEURL;
  return `${baseUrl}/img/avatar/${id}`;
}

export default publicRouter;
