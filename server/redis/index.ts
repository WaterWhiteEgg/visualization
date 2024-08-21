import { createClient } from "redis";
import { isDEV, MyClientURL } from "../key";
import { clientURL } from "../realdata/key";

const doCreateClient = () => {
  try {
    // 创建 Redis 客户端
    const client = createClient({ url: isDEV ? MyClientURL : clientURL });

    // 错误处理
    // 仅提供一次错误
    let isOnceError = false;

    client.on("error", (err) => {
      if (!isOnceError) {
        console.log("redis 缓存系统启动失败，请检查错误详情");
        console.log(err);
        isOnceError = true;
      }

      // client.quit();
    });

    // 开启

    client.connect();

    return client;
  } catch (err) {
    console.error("创建redis时发生错误：", err);

    // 可以根据实际情况进行错误处理
    return err as never;
  }
};
const CLIENT = doCreateClient();

export default CLIENT;
