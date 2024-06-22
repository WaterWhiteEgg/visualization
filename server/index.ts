// index.ts
import express from "express";
import cors from "cors";
import { type CorsOptions } from "cors";
import { MYSECRET_KEY, isDEV } from "./key";
import { SECRET_KEY } from "./realdata/key";

import { error } from "./middleware/error";

import router from "./router/router";
import loginComponent from "./login_component/login_component";
import weatherRouter from "./router/weather";
import emailRouter from "./email/emailRouter";

// 防止一个ip请求过多
import { limiter } from './limit/index'



const corsOptions: CorsOptions = {
  origin: [],
  optionsSuccessStatus: 200,
};
// 判断是否是开发环境
corsOptions.origin = isDEV
  ? ["http://localhost:5173"]
  : ["http://8.134.196.45"];
import { expressjwt } from "express-jwt";

const app = express();
app.use(error);
app.use(cors(corsOptions));

// 解析token
app.use(
  expressjwt({
    secret: isDEV ? MYSECRET_KEY : SECRET_KEY,
    algorithms: ["HS256"], // 使用何种加密算法解析
  }).unless({ path: [/^\/db\/*/,/^\/email\/*/, "/weather", "/city", "/ipcity", "/myip"] }) // 登录页无需校验
);

// 解析post的两个中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(middleware);
app.use(router);
app.use(weatherRouter);
app.use("/db/", loginComponent);
app.use("/email/", emailRouter);

// ip请求限制
app.use(limiter)

app.listen(2000, () => {
  console.log("mode is " + process.env.NODE_ENV);
  console.log("server open :2000");
});
