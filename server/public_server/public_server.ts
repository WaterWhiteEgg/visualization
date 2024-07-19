import express from "express";
import multer from "multer";

import type { Router } from "express";
import { key } from "../realdata/key";
import { MYkey, isDEV, LOCALBASEURL } from "../key";
const publicRouter: Router = express.Router();

// 处理头像文件路径
const avatarFile = multer({ dest: "../public/img/avatar/" });

// 获取头像id
export function imgId(id: string = "default.jpg") {
  return `${LOCALBASEURL}/img/avatar/${id}`;
}

publicRouter.post("/avatar",avatarFile.single('avatar'), (req, res) => {
console.log(req.file);

  res.send({});
});
export default publicRouter;
