import type { Router } from "express";
const connection = require("./dbmain")

const dbrouter: Router = require("./router");

dbrouter.post("/test", async (req, res) => {

    console.log(req.body);
    const { name, password, resource } = req.body
    let set = `INSERT INTO _user (username, password, status) VALUES ('${name}', '${password}', '${resource}')`;
    connection.query(set, function (err: any, results: any, fields: any) {
        console.log(err);
        
        res.send({
            status: 0,
            message: "插入成功",
        })
        res.end(); // 结束响应
    })
    
});

module.exports = dbrouter


