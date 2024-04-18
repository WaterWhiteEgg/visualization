// index.ts
import express from "express";
import cors from "cors";
import { SECRET_KEY } from "./key";

const { middleware } = require("./middleware");

const router = require("./router");
const dbrouter = require("./dbrouter");

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
import { expressjwt } from "express-jwt";

const app = express();

// 解析token
app.use(
  expressjwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"], // 使用何种加密算法解析
  }).unless({ path: [/^\/*/] }) // 登录页无需校验
);

// 解析post的两个中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use(middleware);
app.use(router);
// app.use("/db/", dbrouter);

app.listen(2000, () => {
  console.log("server open 127.0.0.1:2000");
});
