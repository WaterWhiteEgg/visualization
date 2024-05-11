// 初始化仓库,输入你的mysql所在的服务器地址，注册的用户名，密码，使用的数据库
import fs from "fs";
import mysql, { ConnectionOptions } from "mysql2";
// 查找生产数据库路径
let customConfigFile = "./realdata/realOption.ts";
// 本地开发数据库配置
let connection = mysqlCreate({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "basic_users",
});

// 创建数据库链接
function mysqlCreate(option: {
  host: string;
  user: string;
  password: string;
  database: string;
}) {
  return mysql.createConnection(option);
}

// 检查是否存在除本地外的真实数据库配置文件，可根据文件名修改
if (fs.existsSync(customConfigFile)) {
  let option = require(customConfigFile);
  connection = mysqlCreate(option);
}

connection.connect();

export default connection;
