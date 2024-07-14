import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import("../views/index/indexCityMap.vue");
const HomeLogin = () => import("../views/login/loginIndex.vue");
const HomeUser = () => import("../views/user/userIndex.vue");
const HomeRegister = () => import("../views/register/registerIndex.vue");
const HomeError = () => import("../views/error/errorIndex.vue");
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/index",
    },
    {
      path: "/error",
      name: "error",
      component: HomeError,
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
    {
      path: "/user/:user_id",
      name: "user",
      component: HomeUser,
    },
  ],
});

export default router;
