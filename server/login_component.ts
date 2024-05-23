import { MYSECRET_KEY, isDEV } from "./key";
import { SECRET_KEY } from "./realdata/key";
import jwt from "jsonwebtoken";
import express from "express";
import connection from "./dbmain";

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
  user_agent: string;
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
  // console.log(req.body);
  // 解构获取的数据
  const {
    name,
    againPassword,
    resource,
    desc,
    region,
    user_agent,
  }: RuleRegisterForm = req.body;

  // 查询下一个唯一id
  let id: string;
  try {
    id = await selectId();
  } catch (error) {
    id = "未查询到id";
    res.cc(error as Error);
  }

  // 生成token
  let token: string;
  const expiresIn = resource === "1" ? "720h" : "60s";
  token = jwt.sign(
    { user: { name }, user_id: { id }, status: { resource } },
    secret_key,
    { expiresIn }
  );

  // 用户的网络信息
  const other_security = JSON.stringify({
    ip: req.ip,
  });
  // 用户的其他信息
  const other_Information = JSON.stringify({});
  // 注册sql语句
  const set = `INSERT INTO ${table_name} (username,user_id, password, status,gender,descs,token,other_security,user_agent,other_Information) VALUES (?,?,?,?,?,?,?,?,?,?)`;

  connection.query(
    set,
    [
      name,
      id,
      againPassword,
      resource,
      region,
      desc,
      token,
      other_security,
      user_agent,
      other_Information,
    ],
    function (err, results, fields) {
      // 登录错误处理
      if (err) {
        return res.cc(err);
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

// // 用户名登录
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { name, password, resource, user_id }: RuleLoginForm = req.body;
  // 查询name是用户名时找不找到，在查询是用户id时找不找到
  let set = `SELECT * 
  FROM ${table_name} 
  WHERE username = ? 
  OR user_id = ? 
  LIMIT 1;`;
  connection.query(set, [name, name], function (err, results, fields) {
    console.log(results,fields);
    
    res.send({
      status: 0,
      message: "登录成功",
    });
    res.end(); // 结束响应
  });
});

export default router;
