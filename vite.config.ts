import { fileURLToPath, URL } from "node:url";
import ConditionalCompile from "vite-plugin-conditional-compiler";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 实现条件编译
    ConditionalCompile(),
    // 压缩代码
    viteCompression(),
    
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
