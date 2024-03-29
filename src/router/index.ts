import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("../views/index/index.vue");
const HomeLogin = () => import("../views/login/login.vue");
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/index",
    },
    {
      path: "/index",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: HomeLogin,
    },
  ],
});

export default router;
