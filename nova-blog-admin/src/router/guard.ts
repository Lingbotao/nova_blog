import type { Router } from "vue-router"

export function setupRouterGuard(router:Router) {
  createPermissionGuard(router)
}

function createPermissionGuard(router:Router) {
  router.beforeEach(async (to:any, from:any) => {
    if(['/login', '/404'].includes(to.path)) {
      return true
    }

    // 有 Token 的时候无需访问登录页面
    if (to.name === 'Login') {
      window.$message.success('已登录，无需重复登录！')
      return { path: from.fullPath || '/home' }
    }

    // 能在路由中找到, 则正常访问
    if (router.getRoutes().find(e => e.name === to.name)) {
      return true
    }

    return { name: '404', query: { path: to.fullPath } }

  })
}