import "./assets/main.css";

import "default-passive-events";

import App from "./App.vue";
import router from "./router/index";
import "./router/middleware"; // 导入路由守卫
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import { createApp } from "vue";
export const app = createApp(App);

import pinia from "./stores/index";
app.use(pinia);

app.use(router);

app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
