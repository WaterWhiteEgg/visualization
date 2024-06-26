// 初始化仓库,输入你的mysql所在的服务器地址，注册的用户名，密码，使用的数据库
import mysql from "mysql2";
import CONNECTION from "../realdata/realOption";
import { isDEV } from "../key";

// 创建数据库链接
function mysqlCreate(option: {
  host: string;
  user: string;
  password: string;
  database: string;
}) {
  return mysql.createConnection(option);
}

// 本地开发数据库配置,根据模式使用不同的配置
const connection = isDEV
  ? mysqlCreate({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "basic_users",
    })
  : mysqlCreate(CONNECTION);

// console.log(connection);

connection.connect();

// 监听错误事件
connection.on("error", (err) => {
  console.log("mysql 数据库系统连接失败，请检查错误详情");
  console.error(err);

});

export default connection;
