import express from "express";
import type { Router } from "express";
import axios from "axios";

import { key } from "../realdata/key";
import { MYkey, isDEV } from "../key";
const userRouter: Router = express.Router();
// 查询用户的token，本身并没有处理别的
userRouter.get("/user", async (req, res) => {
console.log(req.auth);

  res.send({
    status: 0,
    message: "查询成功",
  });
});

export default userRouter;
