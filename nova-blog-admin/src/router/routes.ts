import { HomeFilled, Files, EditPen, List } from '@element-plus/icons-vue'

export const adminMenuRoutes:any[] = [
  {
    name: "Home",
    path: "/home",
    component: () => import("@/views/layout/index.vue"),
    meta: {
      title: "首页",
      showIcon: true,
      iconComp: HomeFilled
    },
  }, {
    name: "Article",
    path: "/article",
    component: () => import("@/views/layout/index.vue"),
    redirect: '/article/publish',
    meta: {
      title: '文章管理',
      showIcon: true,
      iconComp: Files
    },
    children: [{
      name: "Publish",
      path: "/article/publish",
      component: () => import("@/views/article/publish/index.vue"),
      meta: {
        title: '发布文章',
        showIcon: true,
        iconComp: EditPen
      }
    }, {
      name: "List",
      path: "/article/list",
      component: () => import("@/views/article/list/index.vue"),
      meta: {
        title: '文章列表',
        showIcon: true,
        iconComp: List
      }
    }]
  }
];
