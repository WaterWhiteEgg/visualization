const express = require("express");
import axios from "axios";
import type { Router } from "express";

const router: Router = express.Router();

router.get("/weather", async (req, res) => {
    console.log(req.query);
    
  const result = await axios.get(
    "https://restapi.amap.com/v3/weather/weatherInfo",
    {
      params: {
        key: "8a4977220888c941451dee7742d6a3e3",
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

module.exports = router;
