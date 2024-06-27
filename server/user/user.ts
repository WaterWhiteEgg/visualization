import express from "express";
import type { Router } from "express";
import axios from "axios";

import { key } from "../realdata/key";
import { MYkey, isDEV } from "../key";
const userRouter: Router = express.Router();

userRouter.get("/user", async (req, res) => {
  res.send({
    status: 0,
    message: "查询成功",
  });
});

export default userRouter;
