import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("../views/index/indexCityMap.vue");
const HomeLogin = () => import("../views/login/loginIndex.vue");
const HomeRegister = () => import("../views/register/registerIndex.vue");
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
    {
      path: "/register",
      name: "register",
      component: HomeRegister,
    },
  ],
});

export default router;
