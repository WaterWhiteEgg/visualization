import express from "express";
import type { Router } from "express";
import { key } from "../realdata/key";
import { MYkey, isDEV, LOCALBASEURL } from "../key";
const publicRouter: Router = express.Router();


// 获取头像id
export function imgId(id: string = "default.jpg") {
  return `${LOCALBASEURL}/img/avatar/${id}`;
}

export default publicRouter;
