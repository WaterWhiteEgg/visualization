// 初始化仓库,输入你的mysql所在的服务器地址，注册的用户名，密码，使用的数据库
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'baseUser'
});

connection.connect();


module.exports = connection