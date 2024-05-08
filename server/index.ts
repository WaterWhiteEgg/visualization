// index.ts
import express from "express";
import cors from "cors";
import { type CorsOptions } from "cors";
import { MYSECRET_KEY, isDEV } from "./key";
import { SECRET_KEY } from "./realdata/key";

import {} from "./middleware";

import router from "./router";
// import dbrouter from "./dbrouter";
import weatherRouter from "./weather";
// , "http://localhost:5173"

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
app.use(cors(corsOptions));

// 解析token
app.use(
  expressjwt({
    secret: isDEV ? MYSECRET_KEY : SECRET_KEY,
    algorithms: ["HS256"], // 使用何种加密算法解析
  }).unless({ path: [/^\/*/] }) // 登录页无需校验
);

// 解析post的两个中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(middleware);
app.use(router);
app.use(weatherRouter);
// app.use("/db/", dbrouter);

app.listen(2000, () => {
  console.log("mode is " + process.env.NODE_ENV);
  console.log("server open :2000");
});
