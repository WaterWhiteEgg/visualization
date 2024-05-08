import express from "express";
import type { Router } from "express";
import axios from "axios";

// 用commonjs方式来引入key，当生产模式时才会找这个key，缺少文件不报错
const key = require("./realdata/key");

import { MYkey, isDEV } from "./key";
const weatherRouter: Router = express.Router();

weatherRouter.get("/weather", async (req, res) => {
  // console.log(req.query);
  const result = await axios.get(
    "https://restapi.amap.com/v3/weather/weatherInfo",
    {
      params: {
        key: isDEV ? MYkey : key,
        city: req.query.city,
      },
    }
  );
  //   console.log(result.data);

  res.send({
    status: 0,
    message: "查询成功",
    data: result.data,
  });
});

// https://devapi.qweather.com/v7/weather/7d?key==114.34,30.54
export default weatherRouter;
