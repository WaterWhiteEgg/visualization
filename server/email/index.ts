// 登录 QQ 邮箱，进入邮箱设置页面。
// 在左侧菜单栏中选择“账户”，然后在“安全中心”中开启“POP3/SMTP/IMAP4/Exchange/CardDAV/CalDAV服务”。
// 在“POP3/SMTP/IMAP4/Exchange/CardDAV/CalDAV服务”中，找到“开启SMTP服务”选项，开启该选项。
// 在“SMTP服务”中，找到“授权码”，并复制该授权码，该授权码将用于 Node.js 中的邮件发送。

// 引入包
import nodemailer from "nodemailer";
// 授权码
import { qqKey, qqEmail } from "../realdata/key";
import { isDEV, MYqqKey, MYqqEmail } from "../key";

export const useQQKetyEmail = isDEV ? MYqqKey : qqKey;
export const useQQEmail = isDEV ? MYqqEmail : qqEmail;

// 创建一个邮件传输对象
export const transporter = nodemailer.createTransport({
  service: "qq",
  host: "smtp.qq.com", // QQ 邮箱的 SMTP 服务器地址
  port: 465, // SMTP 服务器的端口号 这个接口可能有时候有网络问题，看情况换新的接口
  secure: true, // 使用 SSL 加密连接
  auth: {
    // 输入你开启服务的账号以及授权码
    user: useQQEmail, // 邮箱账号
    pass: useQQKetyEmail, // 邮箱密码或授权码
  },
});

// 这是发送邮件的用法，mailOptions是需要包含的信息

// 比如 const mailOptions = {
//     from: 'your_email_address', // 发件人邮箱地址
//     to: 'recipient_email_address', // 收件人邮箱地址
//     subject: 'Verification Code', // 邮件主题
//     text: `Your verification code is ${code}.` // 邮件正文
//   };

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
