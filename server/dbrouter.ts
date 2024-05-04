// import type { Router } from "express";
// import { MYSECRET_KEY } from "./key"
// import jwt from 'jsonwebtoken'

// const connection = require("./dbmain")

// const dbrouter: Router = require("./router");

// dbrouter.post("/commit", async (req, res) => {

//     const { name, password, resource, desc, region } = req.body
//     let set = `INSERT INTO _user (username, password, status,gender,descs) VALUES ('${name}', '${password}', '${resource}','${region}','${desc}')`;
//     connection.query(set, function (err: any, results: any, fields: any) {
//         // 插入成功生成token
//         let token: string;
//         if (resource === 1) {
//             token = jwt.sign(
//                 { user: { name } },
//                 SECRET_KEY,
//                 { expiresIn: '720h' }
//             )
//         } else {
//             token = jwt.sign(
//                 { user: { name } },
//                 SECRET_KEY,
//                 { expiresIn: '60s' })
//         }

//         console.log(err && "没有错误");
//         res.send({
//             status: 0,
//             message: "插入成功",
//             token,
//         })
//         res.end(); // 结束响应
//     })

// });

// dbrouter.post("/login", async (req, res) => {

//     // console.log(req.body);
//     const { name, password, resource, desc, region } = req.body
//     let set = `INSERT INTO _user (username, password, status,gender,descs) VALUES ('${name}', '${password}', '${resource}','${region}','${desc}')`;
//     connection.query(set, function (err: any, results: any, fields: any) {
//         console.log(err);
//         res.send({
//             status: 0,
//             message: "插入成功",
//         })
//         res.end(); // 结束响应
//     })

// });
// module.exports = dbrouter


