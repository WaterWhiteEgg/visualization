import { MYSECRET_KEY, isDEV } from "./key";
import { SECRET_KEY } from "./realdata/key";
import jwt from "jsonwebtoken";
import express from "express";
import connection from "./dbmain";
import { QueryError } from "mysql2";

const router = express.Router();
// 哪个环境决定使用哪个环境的key
let secret_key = isDEV ? MYSECRET_KEY : SECRET_KEY;
// 表名
let table_name = "_user";

type RuleRegisterForm = {
  name: string;
  region: string;
  againPassword: string;
  resource: string;
  desc: string;
};
type RuleLoginForm = {
  user_id: string;
  name: string;
  password: string;
  resource: string;
};

// 注册

// 关于性别：数据库表现是男为0，女为1，其他为2

router.post("/register", async (req, res) => {
  // 数据打印查看
  console.log(req.body);
  // 解构获取的数据
  const { name, againPassword, resource, desc, region }: RuleRegisterForm =
    req.body;

  // 查询下一个唯一id
  let id: string;
  try {
    id = await selectId();
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "注册失败，服务器的问题！" });
  }

  // 生成token
  let token: string;
  const expiresIn = resource === "1" ? "720h" : "60s";
  token = jwt.sign({ user: { name } }, secret_key, { expiresIn });

  // 注册sql语句
  const set = `INSERT INTO ${table_name} (username,user_id, password, status,gender,descs,token) VALUES (?,?,?,?,?,?,?)`;

  connection.query(
    set,
    [name, id, againPassword, resource, region, desc, token],
    function (err, results, fields) {
      // 登录错误处理
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "注册失败，服务器的问题！" });
      }

      res.send({
        status: 0,
        message: "插入成功",
        token,
      });
      res.end(); // 结束响应
    }
  );
});

// 查询下一个唯一id

// 查询下一个可用的自增ID
const getId = `SELECT AUTO_INCREMENT AS id FROM information_schema.tables WHERE table_name = '${table_name}' AND table_schema = DATABASE()`;

async function selectId(): Promise<string> {
  return new Promise((resolve, reject) => {
    connection.query(getId, function (err, results, fields) {
      // 登录错误处理
      if (err) {
        reject(err);
        return;
      }
      // 获取id
      const TSres = results as { id: number }[];
      resolve(`w${10000 + TSres[0].id}`);
      // console.log(id);
    });
  });
}

// // 登录
// router.post("/login", async (req, res) => {
//   // console.log(req.body);
//   const { name, password, resource, user_id }: RuleLoginForm = req.body;
//   let set = `SELECT  ${table_name}(username, password, status,gender,descs) VALUES ('${name}', '${password}', '${resource}')`;
//   connection.query(set, [], function (err, results, fields) {
//     console.log(err);
//     res.send({
//       status: 0,
//       message: "登录成功",
//     });
//     res.end(); // 结束响应
//   });
// });

export default router;
