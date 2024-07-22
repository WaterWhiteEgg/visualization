import express from "express";
import multer from "multer";
import bodyParser from "body-parser";
import crypto from "crypto";
import path from "path";
import type { Router } from "express";
import { key } from "../realdata/key";
import { MYkey, isDEV, LOCALBASEURL } from "../key";
const publicRouter: Router = express.Router();

// 处理文件储存相关
const storage = multer.diskStorage({
  // 储存位置
  destination: function (req, file, cb) {
    cb(null, "./public/img/avatar/");
  },
  // 文件名,哈希+时间戳+文件扩展名
  filename: function (req, file, cb) {
    crypto.randomBytes(16, (err, raw) => {
      cb(
        null,
        raw.toString("hex") + Date.now() + path.extname(file.originalname)
      );
    });
  },
});

// 处理文件
const avatarFile = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 限制文件大小为 2MB
    files: 1, // 限制文件数量为 1
  },
});

// 获取头像id
export function imgId(id: string = "default.jpg") {
  return `${LOCALBASEURL}/img/avatar/${id}`;
}

publicRouter.post("/avatar", avatarFile.single("avatar"), (req, res) => {
  console.log(req.file);

  res.send({});
});
export default publicRouter;
