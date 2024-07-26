import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import type { Router } from "express";
import { ResultSetHeader } from "../login_component/login_component";
import { key } from "../realdata/key";
import { MYkey, isDEV, LOCALBASEURL } from "../key";
const publicRouter: Router = express.Router();

// 表名
import connection from "../db/dbmain";
const table_name = "_user";

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

  // 获取token的数据
  const tokenValue = req.auth;

  // 获取头像的网址
  const avatarUrl = imgId(req.file!.filename);
  // 查询name是用户名时找不找到后，再查询是用户id找不找到
  const set = `UPDATE ${table_name} SET avatar_url = ? WHERE user_id = ?`;

  connection.query(
    set,
    [avatarUrl, tokenValue!.user.user_id],
    function (err, results) {
      // 更新错误处理
      if (err) {
        return res.cc(err);
      }

      // 验证成功
      // 判断是否修改失败
      if ((results as ResultSetHeader).affectedRows !== 1) {
        res.cc("修改失败");
      }

      res.send({
        status: 0,
        massage: "修改成功",
        url: avatarUrl,
      });
    }
  );
});
export default publicRouter;
