// index.ts
import express from "express";
import cors from "cors";
import os from "os"

function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface!.length; i++) {
      var alias = iface![i];
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
const a = getIPAdress();
const { middleware } = require("./middleware");

const router = require("./router");

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));

app.use(middleware);
app.use(router);

app.listen(2000, () => {
  console.log("server open 127.0.0.1:2000");
  console.log(a);
});
