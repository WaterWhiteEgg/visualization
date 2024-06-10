import { MYSECRET_KEY, isDEV } from "../key";
import { SECRET_KEY } from "../realdata/key";
import jwt from "jsonwebtoken";
import express from "express";
import connection from "../db/dbmain";
// import CLIENT from "../redis/index";
import { QueryResult } from "mysql2";
import bcrypt from "bcrypt";
// 表单验证
import expressJoi from "@escook/express-joi";
import { VdRegister, VdLogin, VdUsername } from "../middleware/validationForm";
import { verifyEmail } from "../email/emailRouter";
const router = express.Router();
// 哪个环境决定使用哪个环境的key
const secret_key = isDEV ? MYSECRET_KEY : SECRET_KEY;
// 表名
const table_name = "_user";

type RuleRegisterForm = {
  user_agent: string;
  name: string;
  againPassword: string;
  email: string;
  validate: string;
  emailCode: string;
  phone: null | string;
  phoneCode: null | string;
  region: string;
  desc: string;
  password: string;
  resource: string;
};

type RuleLoginForm = {
  user_agent: string;
  user_id: string;
  name: string;
  password: string;
  resource: string;
};

// 这是使用updete等会获得的字段
export interface ResultSetHeader {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

// 数据库列表数据
export interface User {
  id: number;
  username: string;
  password: string;
  status: number;
  descs: string;
  gender: number;
  user_id: string;
  is_guest: number;
  email: string;
  phone_number: string;
  registration_time: string;
  last_time: string;
  login_count: number;
  is_active: number;
  is_admin: number;
  other_Information: string;
  other_security: string;
  user_agent: string;
  token: string;
}

// 注册

// 关于性别：数据库表现是男为0，女为1，其他为2

router.post("/register", expressJoi(VdRegister), async (req, res) => {
  // 解构获取的数据
  const {
    name,
    againPassword,
    resource,
    desc,
    region,
    user_agent,
    email,
    emailCode,
    phone,
    phoneCode,
    validate,
  }: RuleRegisterForm = req.body;

  // console.log(req.body);
  // 验证登录方式，且验证是否通过

  const validateRes = await switchLogin(validate, { email });

  // 查询下一个唯一id
  let id: string;
  try {
    id = await selectId();
  } catch (error) {
    id = "未查询到id";
    res.cc(error as Error);
    res.end();
  }

  // 生成token
  const token = generateToken({ name, resource });
  // 用户的网络信息
  const other_security = createSecurity(req.ip);
  // 用户的其他信息
  const other_Information = createOtherInformation();

  // 生成加密过的密码
  const hashPassword = await bcrypt.hash(againPassword, 10);

  // 注册sql语句
  const set = `INSERT INTO ${table_name} (username,user_id, password, status,gender,descs,token,other_security,user_agent,other_Information) VALUES (?,?,?,?,?,?,?,?,?,?)`;

  connection.query(
    set,
    [
      name,
      id,
      hashPassword,
      resource,
      region,
      desc,
      token,
      other_security,
      user_agent,
      other_Information,
    ],
    function (err) {
      // 登录错误处理
      if (err) {
        return res.cc(err);
      }

      res.send({
        status: 0,
        message: "注册成功",
        token,
      });

      // 结束响应
      res.end();
    }
  );
});
// 创建一个用户的网络信息
function createSecurity(ip?: string) {
  return JSON.stringify({
    ip,
  });
}
// 创建一个用户的其他信息
function createOtherInformation(obj: object = {}) {
  return JSON.stringify(obj);
}

// 获取token
function generateToken(item: { name: string; resource: string }) {
  const { name, resource } = item;
  const expiresIn = resource === "1" ? "720h" : "60s";
  const token = jwt.sign({ user: { name }, status: { resource } }, secret_key, {
    expiresIn,
  });
  return token;
}

// 查询使用什么登录/注册账号
function switchLogin(validate: string, data: { email?: string }) {
  let inValidateRes: object = { status: 1, message: "没有处理结果" };
  switch (validate) {
    case "邮箱验证":
      verifyEmail(data.email || "")
        .then((res) => {
          inValidateRes = res as object;
          return inValidateRes;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
      break;
    case "手机认证":
      console.log("手机认证不支持");

      break;

    default:
      console.log("账户登录");
      break;
  }
}

// 查询下一个可用的自增ID
async function selectId(): Promise<string> {
  const getId = `SELECT MAX(id) AS id FROM ${table_name}`;

  return new Promise((resolve, reject) => {
    connection.query(getId, function (err, results) {
      // 登录错误处理
      if (err) {
        reject(err);
        return;
      }
      // 获取id

      const TSres = results as { id: number }[];
      // console.log(TSres);
      // 决定user_id格式，w+10000+自增id下一个数字
      resolve(`w${10000 + TSres[0].id + 1}`);
      // console.log(id);
    });
  });
}

// 用户名登录
router.post("/login", expressJoi(VdLogin), async (req, res) => {
  // console.log(req.body);
  // 登录里的name有可能是user_id 也有可能是用户名

  const { name, password, resource, user_agent }: RuleLoginForm = req.body;
  // 查询用户名
  let nameOfObj: SelectUsernameAndIdResolve | null = null;

  try {
    nameOfObj = await selectUsernameAndId(name);
  } catch (error) {
    res.cc(error as Error);
  }
  // 如果长度不为一则有问题，不允许登录
  if (nameOfObj?.length !== 1) {
    res.send({
      status: 1,
      message: "登录失败，找不到具体用户",
    });
  }
  // 长度为一时
  else {
    // 也就是寻找成功，这时候要验证密码
    const isOk = await bcrypt.compare(
      password,
      (nameOfObj.results as User[])[0].password
    );
    // 密码错误时
    if (!isOk) {
      res.send({
        status: 1,
        message: "密码错误",
      });
    }
    // 密码验证成功执行下一步
    else {
      // 额外提供token，并更新用户信息
      // 生成token
      const token = generateToken({ name, resource });

      // 更新该用户的信息
      // 首先是获取一些寻找用户时记录的信息
      const { user_id, login_count } = (nameOfObj.results as User[])[0];

      // 更新用户信息
      let updateUserRes: {
        message: string;
        status: number;
      } | null = null;

      try {
        updateUserRes = await updateUser(
          user_id,
          token,
          login_count,
          user_agent,
          req.ip
        );
      } catch (error) {
        res.cc(error as Error);
      }

      // 判断用户信息是否更改成功
      if (updateUserRes?.status) {
        // 错误处理
        res.send({
          status: 1,
          message: updateUserRes.message,
        });
      }
      // 更新用户数据成功
      else {
        res.send({
          status: 0,
          token,
          message: "登录成功",
        });
      }
    }
  }

  // console.log(nameOfObj);
  // 结束响应
  res.end();
});

// 更新登录者列里的值
function updateUser(
  user_id: string,
  token: string,
  login_count: number,
  user_agent: string,
  ip: string | undefined
): Promise<{
  message: string;
  status: number;
}> {
  const setUser = `UPDATE ${table_name} SET last_time = NOW(), token = ?,login_count=?,user_agent=?,other_security=?,other_Information=? WHERE user_id = ?`;
  // 获取服务器上的安全信息
  // 用户的网络信息
  const other_security = createSecurity(ip);
  // 用户的其他信息
  const other_Information = createOtherInformation();

  return new Promise((resolve, reject) => {
    connection.query(
      setUser,
      [
        token,
        login_count + 1,
        user_agent,
        other_security,
        other_Information,
        user_id,
      ],
      function (err, results) {
        // 登录错误处理
        if (err) {
          reject(err);
          return;
        }
        // 判断是否修改成功
        if ((results as ResultSetHeader).affectedRows === 1) {
          resolve({
            message: "修改成功",
            status: 0,
          });
        }
        // 修改失败时
        else {
          resolve({
            message: "修改失败",
            status: 1,
          });
        }
      }
    );
  });
}

// 验证用户名/用户id
router.post("/username", expressJoi(VdUsername), async (req, res) => {
  // console.log(req.body);
  // 登录里的name有可能是user_id 也有可能是用户名
  const { name }: RuleLoginForm = req.body;
  // 查询用户名
  let nameOfObj: SelectUsernameAndIdResolve | null = null;
  // 查询selectUsernameAndId有没有内容
  try {
    nameOfObj = await selectUsernameAndId(name);
  } catch (error) {
    res.cc(error as Error);
  }

  // 如果长度小于一则没有问题，大于一则有重复的用户
  if (nameOfObj?.length && nameOfObj.length >= 1) {
    res.send({
      status: 1,
      message: "重复的用户名",
    });
  }
  // 为空的情况
  else {
    res.send({
      status: 0,
      message: "未查找到重复的用户名",
    });
  }
});

// 验证用户名/用户id的处理resolve名
interface SelectUsernameAndIdResolve {
  results: QueryResult;
  length: number;
  status: number;
  message: string;
}
// 验证用户名/用户id的处理函数
function selectUsernameAndId(name: string) {
  return new Promise(
    (resolve: (value: SelectUsernameAndIdResolve) => void, reject) => {
      // 查询name是用户名时找不找到后，再查询是用户id找不找到
      const set = `SELECT * 
      FROM ${table_name} 
      WHERE username = ? 
      OR user_id = ? 
      LIMIT 1;`;

      connection.query(set, [name, name], function (err, results) {
        // 登录错误处理
        if (err) {
          reject(err);
        }
        // console.log((results as User[]).length);
        // 如果长度为1则找到，0则未找到
        if ((results as User[]).length) {
          resolve({
            results,
            length: (results as User[]).length,
            status: 0,
            message: `找到了${(results as User[]).length}个用户`,
          });
        } else {
          resolve({
            results,
            length: (results as User[]).length,
            status: 1,
            message: "未找到用户名",
          });
        }
      });
    }
  );
}

export default router;
