import express from "express";
import axios from "axios";
import type { Router } from "express";
import { MYkey, MYIPkey } from "../key";
import { IPkey, key } from "../realdata/key";
import { isDEV } from "../key";
const router: Router = express.Router();


router.get("/city", async (req, res) => {
  const result = await axios.get(
    "https://restapi.amap.com/v3/config/district?parameters",
    {
      params: {
        key: isDEV ? MYkey : key,
        keywords: req.query.keywords,
      },
    }
  );
  // console.log(result.data);

  res.send({
    status: 0,
    message: "查询成功",
    data: result.data,
  });
});
router.get("/ipcity", async (req, res) => {
  
  const result = await axios.get("http://apis.juhe.cn/ip/ipNewV3", {
    params: {
      key: isDEV ? MYIPkey : IPkey,
      ip: req.query.ip,
    },
  });

  res.send({
    status: 0,
    message: "查询成功",
    data: result.data,
  });
});
router.get("/myip", (req, res) => {
  // 查询ipv4的正则
  const ipv4Regex = /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}/; // 定义IPv4地址的正则表达式
  //  检查是否是回环地址
  if (req.ip === "::1") {
    res.send({
      status: 1,
      message: "回环地址",
      data: "127.0.0.1",
    });
  }
  // 从ipv6提取ipv4
  else {
    const match = ipv4Regex.exec(req.ip as string); // 使用正则表达式匹配IPv4地址部分
    const ipv4 = match ? match[0] : null; // 如果匹配成功，则获取IPv4地址，否则为null
    console.log(req.ip); // 输出IPv4地址部分
    res.send({
      status: 0,
      message: "查询成功",
      data: ipv4,
    });
  }
});

export default router;
