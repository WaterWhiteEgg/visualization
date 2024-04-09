const express = require("express");
import axios from "axios";
import os from "os"
import type { Router } from "express";
import { key } from "./key";
const router: Router = express.Router();

router.get("/weather", async (req, res) => {
  // console.log(req.query);
  const result = await axios.get(
    "https://restapi.amap.com/v3/weather/weatherInfo",
    {
      params: {
        key,
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

router.get("/city", async (req, res) => {

  const result = await axios.get(
    "https://restapi.amap.com/v3/config/district?parameters",
    {
      params: {
        key,
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

  const result = await axios.get(
    "https://restapi.amap.com/v3/ip",
    {
      params: {
        key,
        ip: req.query.ip,
      },
    }
  );

  res.send({
    status: 0,
    message: "查询成功",
    data: result.data,
  });
});
router.get("/myip", (req, res) => {

  const myIp = function () {
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
      let iface = interfaces[devName];
      for (let i = 0; i < iface!.length; i++) {
        let alias = iface![i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }
  }
  const ip = myIp();
  res.send({
    status: 0,
    message: "查询成功",
    data: ip,
  });
});


module.exports = router;
