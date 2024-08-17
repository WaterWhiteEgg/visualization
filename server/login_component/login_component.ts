import { MYSECRET_KEY, isDEV, DEVtable_name } from "../key";
import { SECRET_KEY, PROtable_name } from "../realdata/key";
import jwt from "jsonwebtoken";
import express from "express";
import connection from "../db/dbmain";
// import CLIENT from "../redis/index";
import { QueryResult } from "mysql2";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ResRej } from "../middleware/middleware";
import { imgId } from "../public_server/public_server";

// 表单验证
import expressJoi from "@escook/express-joi";
import {
  VdRegister,
  VdLogin,
  VdUsername,
  VdGuestLogin,
} from "../middleware/validationForm";
import {
  verificationEmailCode,
  findUsernameVerificationEmailCode,
} from "../email/emailRouter";
const router = express.Router();
// 哪个环境决定使用哪个环境的key
const secret_key = isDEV ? MYSECRET_KEY : SECRET_KEY;

// 判断模式更改表名
const table_name = isDEV ? DEVtable_name : PROtable_name;

type RuleRegisterForm = {
  user_agent: string;
  name: string;
  againPassword: string;
  email: string;
  validate: string;
  emailCode: string;
  phone: string;
  phoneCode: string;
  region: string;
  desc: string;
  password: string;
  resource: string;
};

type RuleLoginForm = {
  user_agent: string;
  user_id: string;
  validate: string;
  name: string;
  password: string;
  resource: string;
  email: string;
  emailCode: string;
  phone: string;
  phoneCode: string;
};

type RuleGuestLoginForm = {
  user_agent: string;
  validate: string;
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
  avatar_url: string;
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
    validate,
  }: RuleRegisterForm = req.body;

  try {
    // 验证登录方式，且验证是否通过
    const validateRes = await switchLogin(validate, req.body);
    // 如果validateRes不为0则报错,处理没有被catch捕捉到的错误
    if (validateRes.status) {
      return res.cc(validateRes.message, 1, 200);
    }

    // 查询下一个唯一id

    const id = await selectId();

    // 生成token
    const token = generateToken({ username: name, resource, user_id: id });
    // 用户的网络信息
    const other_security = createSecurity(req.ip);
    // 用户的其他信息
    const other_Information = createOtherInformation();

    // 生成加密过的密码
    const hashPassword = await bcrypt.hash(againPassword, 10);

    // 获取默认头像信息，url格式的
    const avatar_url = imgId();

    // 注册sql语句
    const set = `INSERT INTO ${table_name} (username,user_id, password, status,gender,descs,token,other_security,user_agent,other_Information,email,avatar_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;

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
        email,
        avatar_url,
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
  } catch (error) {
    // 执行过程中可能的错误
    // console.log(error);

    return res.cc(error as Error);
  }
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
function generateToken(item: {
  username: string;
  resource: string;
  user_id: string;
}) {
  const { username, resource, user_id } = item;
  const expiresIn = resource === "1" ? "720h" : "60s";
  const token = jwt.sign(
    { user: { username, user_id }, status: { resource } },
    secret_key,
    {
      expiresIn,
    }
  );
  return token;
}

// 查询下一个可用的自增ID
async function selectId(): Promise<string> {
  const getId = `SELECT MAX(id) AS id FROM ${table_name}`;

  return new Promise((resolve, reject) => {
    connection.query(getId, function (err, results) {
      // 登录错误处理
      if (err) {
        reject({ status: 1, err });
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

// 获取随机的用户名填满哈希
const generateRandomName = (name: string, max = 16, nameLong = 3) => {
  // 将名字随机化
  const hash = crypto.createHash("sha256").update(name).digest("hex"); // 对随机字节进行哈希
  const truncatedName = name.substring(0, nameLong); // 截取原始名称的前nameLong个字符，越小越多哈希
  const hashName = hash.substring(0, max - truncatedName.length); // 截取哈希值确保总长度不超过 max
  return `${truncatedName}${hashName}`;
};
// 用户名登录
router.post("/login", expressJoi(VdLogin), async (req, res) => {
  // console.log(req.body);
  // 登录里的name有可能是user_id 也有可能是用户名

  const { resource, user_agent, validate }: RuleLoginForm = req.body;

  // 因为可以通过邮箱登录，密码登录，这个selectUsernameAndId只有在密码登录才搜索，如果用户是邮箱的话
  // 需要做一个搜唯一邮箱的fun然后找这个验证码的对比，再返回数据
  // 验证登录方式，且验证是否通过
  try {
    const validateRes = await switchLogin(validate, req.body);
    // 如果validateRes不为0则报错,处理没有被catch捕捉到的错误
    // console.log(validateRes);

    if (validateRes.status) {
      return res.cc(validateRes.message, 1, 200);
    }

    // 各种验证没问题时，创建个token并更新登录信息
    // 首先是获取一些寻找用户时记录的信息

    const { username, user_id, login_count } = (
      validateRes.data as { results: User[] }
    ).results[0];

    // 额外提供token
    // 生成token

    // console.log(validateRes.data);

    const token = generateToken({ username, resource, user_id });

    // 更新该用户的信息

    // 更新用户信息
    let updateUserRes: {
      message: string;
      status: number;
    } | null = null;

    updateUserRes = await updateUser(
      user_id,
      token,
      login_count,
      user_agent,
      req.ip
    );

    // 判断用户信息是否更改成功
    if (updateUserRes?.status) {
      // 错误处理
      res.cc(updateUserRes.message);
    }

    // 更新用户数据成功
    res.send({
      status: 0,
      message: "登录成功",
      token: token,
    });
  } catch (error) {
    // 执行过程中可能的错误
    // console.log("登录接口错误",error);
    return res.cc(error as string);
  }

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

// 查询使用什么登录/注册账号
async function switchLogin(
  validate: string,
  data: RuleRegisterForm | RuleLoginForm,
  otherData?: unknown
): Promise<ResRej> {
  // 默认值
  let inValidateStatusObj: ResRej = {
    status: 1,
    message: "没有处理结果或有误",
  };

  try {
    switch (validate) {
      case "邮箱验证":
        inValidateStatusObj = await verificationEmailCode(
          data.email,
          data.emailCode
        );

        break;
      case "手机认证":
        console.log("手机认证不支持");

        break;
      case "用户名登录":
        inValidateStatusObj = await userIdLogin(data.name, data.password);
        break;
      case "邮箱登录":
        inValidateStatusObj = await findUsernameVerificationEmailCode(
          data.email,
          data.emailCode
        );
        break;
      default:
        console.log("用户名登录");
        break;
    }
    // 根据验证码回调的status的状态决定验证;
    return inValidateStatusObj;
  } catch (error) {
    // 错误直接返回1代表status
    // console.log("验证出现问题",error);
    return {
      status: 1,
      message: error as string,
    };
  }
}

// 验证用户名是否重复，密码正确，同时更新数据等情况
function userIdLogin(name: string, password: string): Promise<ResRej> {
  return new Promise((resolve, reject) => {
    async function inUserIdLogin() {
      // 查询用户名
      let nameOfObj: SelectUsernameAndIdResolve | null = null;

      try {
        nameOfObj = await selectUsernameAndId(name);

        // 查询用户列表唯一性
        // 如果长度不为一则数据重复或者没有数据，不允许登录
        // console.log(nameOfObj);

        if (nameOfObj?.length !== 1) {
          reject({
            status: 1,
            message: "用户名找不到",
          });
        }

        // 验证对的上用户时，这时候要验证密码
        const isOk = await bcrypt.compare(
          password,
          (nameOfObj!.results as User[])[0].password
        );
        // 密码错误时
        if (!isOk) {
          reject({ status: 1, message: "密码错误" });
        }

        // 密码验证成功执行下一步
        resolve({ status: 0, message: "密码验证成功", data: nameOfObj });

        // 错误处理
      } catch (error) {
        reject({
          status: 1,
          message: error,
        });
      }
    }
    inUserIdLogin();
  });
}
// 游客登录
// 使用游客登录时，可以免去注册验证
router.post("/guest/login", expressJoi(VdGuestLogin), async (req, res) => {
  // 解构获取的数据
  const { name, resource, password, user_agent }: RuleGuestLoginForm = req.body;
  try {
    // 查询下一个唯一id
    const id = await selectId();
    // 生成随机的用户名
    const realName = generateRandomName(name);
    // 生成token
    const token = generateToken({ username: realName, resource, user_id: id });
    // 用户的网络信息
    const other_security = createSecurity(req.ip);
    // 用户的其他信息
    const other_Information = createOtherInformation();
    // 生成加密过的密码
    const hashPassword = await bcrypt.hash(password, 10);

    // 获取默认头像信息，url格式的
    const avatar_url = imgId();

    // 注册sql语句
    const set = `INSERT INTO ${table_name} (username,user_id, password, status,token,other_security,user_agent,other_Information,avatar_url,is_guest) VALUES (?,?,?,?,?,?,?,?,?,?)`;

    connection.query(
      set,
      [
        realName,
        id,
        hashPassword,
        resource,
        token,
        other_security,
        user_agent,
        other_Information,
        avatar_url,
        1,
      ],
      function (err) {
        // 登录错误处理
        if (err) {
          return res.cc(err);
        }
        res.send({
          status: 0,
          message: "游客注册成功",
          token,
        });
        // 结束响应
        res.end();
      }
    );
  } catch (error) {
    // 执行过程中可能的错误
    // console.log(error);

    return res.cc(error as Error);
  }
});
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
    // 判断是什么东西重复了，因为有可能是填写的用户id名

    (nameOfObj!.results as User[])[0].user_id === name
      ? // 如果相等，则证明是用户id重复否则用户名重复
        res.send({
          status: 1,
          message: "与其他用户的id号重复",
        })
      : res.send({
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
export function selectUsernameAndId(name: string) {
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

// 验证用用户邮箱的处理函数
export function selectEmail(email: string) {
  return new Promise(
    (resolve: (value: SelectUsernameAndIdResolve) => void, reject) => {
      // 查询name是用户名时找不找到后，再查询是用户id找不找到
      const set = `SELECT * 
      FROM ${table_name} 
      WHERE email = ?`;

      connection.query(set, [email], function (err, results) {
        // 登录错误处理
        if (err) {
          reject(err);
        }
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
