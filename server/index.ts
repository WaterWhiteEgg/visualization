// index.ts
import express from "express";
import cors from "cors";
import path from "path";

import { type CorsOptions } from "cors";
import { MYSECRET_KEY, isDEV, BASEURL } from "./key";
import { SECRET_KEY } from "./realdata/key";

import { error } from "./middleware/error";
import { globalError } from "./middleware/global_error";

import router from "./router/router";
import loginComponent from "./login_component/login_component";
import weatherRouter from "./router/weather";
import emailRouter from "./email/emailRouter";
import userRouter from "./user/user";
import publicRouter from "./public_server/public_server";

// 防止一个ip请求过多
import { limiter } from "./limit/index";

const corsOptions: CorsOptions = {
  origin: [],
  optionsSuccessStatus: 200,
};
// 判断是否是开发环境

corsOptions.origin = BASEURL;
import { expressjwt } from "express-jwt";

const app = express();
app.use(error);
app.use(cors(corsOptions));

// 解析token
app.use(
  expressjwt({
    secret: isDEV ? MYSECRET_KEY : SECRET_KEY,
    algorithms: ["HS256"], // 使用何种加密算法解析
  }).unless({
    path: [
      /^\/db\/*/,
      /^\/email\/*/,
      /^\/img\/*/,
      "/weather",
      "/city",
      "/ipcity",
      "/myip",
      "/easyuser",
    ],
  }) // 登录页无需校验
);

// 解析post的两个中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(middleware);
app.use(router);
app.use(weatherRouter);
app.use(userRouter);
app.use("/db/", loginComponent);
app.use("/email/", emailRouter);
app.use("/public/", publicRouter);

// 将 /public/img 目录下的文件暴露出来
app.use("/img", express.static(path.join(__dirname, "public", "img")));

// 全局错误处理
app.use(globalError);
// ip请求限制
app.use(limiter);

import disk from "diskusage";
import os from "os";

// 获取系统的空闲内存，单位为字节

let SYSTEMPATH = os.platform() === "win32" ? "c:" : "/";

// Callbacks
disk.check(SYSTEMPATH, function (err, info) {
  if (err) {
    console.log(err);
  } else {
    console.log(info!.available);
    console.log(info!.free);
    console.log(info!.total);
  }
});

app.listen(2000, () => {
  console.log("mode is " + process.env.NODE_ENV);
  console.log("server open :2000");
});
