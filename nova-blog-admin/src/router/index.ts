import type { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { setupRouterGuard } from "./guard";
import { adminMenuRoutes } from './routes';

const basicRoutes = [
  {
    path: "/:pathMath(.*)",
    redirect: '/login'
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/home/login/index.vue"),
    isHidden: false,
    meta: {
      title: "登录页",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...basicRoutes, ...adminMenuRoutes],
});

export const setupRouter = (app:App<Element>) => {
  setupRouterGuard(router);
  window.$router = router; // router实例需要在注册后才能使用
  app.use(router);
}
