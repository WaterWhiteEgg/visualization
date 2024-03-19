// index.ts
import express from "express";
import cors from "cors";

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

});
