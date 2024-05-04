// index.ts
import express from "express";
import cors from "cors";
import { MYSECRET_KEY } from "./key";

import { middleware } from "./middleware";

import router from "./router";
// import dbrouter from "./dbrouter";
import weatherRouter from "./weather";

const corsOptions = {
  origin: ["http://8.134.196.45", "http://localhost:5173"],
  optionsSuccessStatus: 200,
};
import { expressjwt } from "express-jwt";

const app = express();
app.use(cors(corsOptions));

// 解析token
app.use(
  expressjwt({
    secret: MYSECRET_KEY,
    algorithms: ["HS256"], // 使用何种加密算法解析
  }).unless({ path: [/^\/*/] }) // 登录页无需校验
);

// 解析post的两个中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middleware);
app.use(router);
app.use(weatherRouter);
// app.use("/db/", dbrouter);

app.listen(2000, () => {
  console.log("server open :2000");
});
