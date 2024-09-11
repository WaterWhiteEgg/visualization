import { fileURLToPath, URL } from "node:url";
import ConditionalCompile from "vite-plugin-conditional-compiler";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import cdn from "vite-plugin-cdn-import";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    // 打包体积分析
    visualizer({
      open: true,
      filename: "visualizer.html", //分析图生成的文件名
    }),
    // 实现条件编译
    ConditionalCompile(),
    // 压缩代码
    viteCompression({
      verbose: true, // 是否在控制台中输出压缩结果
      threshold: 1024, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
    }),
    // 按需导入element plus组件。实现自动按需引入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 按需导入element plus 自定义主题。实现组件自动按需导入
    Components({
      resolvers: [ElementPlusResolver({ importStyle: "css" })],
    }),

    // cdn服务
    cdn({
      modules: [
        {
          name: "vue",
          var: "Vue",
          path: ["https://cdn.bootcdn.net/ajax/libs/vue/3.4.15/vue.global.prod.js"],
        },
        {
          name: "ElementPlus",
          var: "ElementPlus",
          path: [
            "https://cdn.bootcdn.net/ajax/libs/element-plus/2.6.1/index.full.js",
          ],         
        },
        {
          name: "echarts",
          var: "echarts",
          path: ["https://cdn.bootcdn.net/ajax/libs/echarts/5.5.0/echarts.js"],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
