import { createClient } from "redis";

const doCreateClient = () => {
  try {
    // 创建 Redis 客户端
    const client = createClient({ url: "redis://127.0.0.1:6379" });

    // 错误处理
    client.on("error", (err) => {
      console.log(err);
      // 在异步函数中抛出异常
      throw new Error(err);
    });

    // 开启

    client.connect();


    return client;
  } catch (err) {
    console.error("发生错误：", err);

    // 可以根据实际情况进行错误处理
    return err as never
  }
};
const CLIENT = doCreateClient();

export default CLIENT;
