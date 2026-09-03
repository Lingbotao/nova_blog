# nova-blog-admin 项目文档

## 1. 项目概述

nova-blog-admin 是 Nova Blog 博客系统的后台管理前端项目，基于 Vue 3 + TypeScript + Vite 构建的后台管理系统。

## 2. 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 核心框架 | Vue | ^3.5.30 |
| 语言 | TypeScript | ~5.9.3 |
| 构建工具 | Vite | ^8.0.1 |
| UI 组件库 | Element Plus | ^2.13.6 |
| 状态管理 | Pinia | ^3.0.4 |
| 路由 | Vue Router | ^5.0.4 |
| Markdown 编辑器 | md-editor-v3 | ^6.4.1 |
| 样式方案 | Tailwind CSS | ^4.2.2 |
| 网络请求 | Axios | ^1.13.6 |
| 加密 | jsencrypt | ^3.5.4 |
| 代码规范 | ESLint | - |

## 3. 目录结构

```
nova-blog-admin/
├── public/                    # 公共静态资源
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/                   # API 接口层
│   │   ├── auth.ts            # 认证相关 API
│   │   └── index.ts           # API 导出入口
│   ├── assets/                # 静态资源
│   │   └── png/               # 图片资源
│   │       └── home-background.png
│   ├── router/                # 路由配置
│   │   ├── guard.ts           # 路由守卫
│   │   ├── index.ts           # 路由初始化
│   │   └── routes.ts          # 路由表定义
│   ├── store/                 # Pinia 状态管理
│   │   ├── index.ts           # Store 初始化
│   │   └── modules/
│   │       └── auth.ts        # 认证状态模块
│   ├── types/                 # TypeScript 类型定义
│   │   ├── auth.d.ts          # 认证相关类型
│   │   └── common.d.ts        # 通用类型
│   ├── utils/                 # 工具函数
│   │   ├── encrypt.ts         # RSA 加密工具
│   │   ├── index.ts           # 工具导出入口
│   │   └── server.ts         # Axios 请求封装
│   ├── views/                 # 页面视图
│   │   ├── article/
│   │   │   ├── list/         # 文章列表页
│   │   │   │   └── index.vue
│   │   │   └── publish/      # 发布文章页
│   │   │       └── index.vue
│   │   ├── home/
│   │   │   ├── error-page/   # 错误页面
│   │   │   │   └── 404.vue
│   │   │   └── login/        # 登录页
│   │   │       └── index.vue
│   │   └── layout/            # 布局组件
│   │       ├── index.vue     # 主布局
│   │       └── sidebar/       # 侧边栏
│   │           └── index.vue
│   ├── App.vue                # 根组件
│   ├── main.ts                # 入口文件
│   └── style.css              # 全局样式
├── .gitignore
├── eslint.config.js           # ESLint 配置
├── index.html                 # HTML 入口
├── package.json               # 项目依赖
├── tsconfig.app.json          # TypeScript 应用配置
├── tsconfig.json              # TypeScript 基础配置
├── tsconfig.node.json         # TypeScript Node 环境配置
└── vite.config.ts             # Vite 配置
```

## 4. 核心模块说明

### 4.1 API 层 (`src/api/`)

- `auth.ts`: 认证相关接口
  - `login(userInfo: string)` - 用户登录 (接收 RSA 加密后的用户信息)
  - `getPubKey()` - 获取 RSA 公钥

### 4.2 路由 (`src/router/`)

- `routes.ts`: 定义后台管理菜单路由
  - `/home` - 首页
  - `/article/publish` - 发布文章
  - `/article/list` - 文章列表

- `guard.ts`: 路由守卫
  - 登录拦截
  - 权限验证
  - 404 处理

### 4.3 状态管理 (`src/store/`)

- `modules/auth.ts`: 认证状态模块 (当前为空，待扩展)

### 4.4 工具 (`src/utils/`)

- `server.ts`: Axios 请求封装，包含请求/响应拦截器
- `encrypt.ts`: RSA 加密工具，用于密码加密传输

## 5. 页面路由

| 路由 | 组件 | 说明 |
|------|------|------|
| `/login` | `views/home/login/index.vue` | 登录页 |
| `/404` | `views/home/error-page/404.vue` | 404 错误页 |
| `/home` | `views/layout/index.vue` | 首页 |
| `/article/publish` | `views/article/publish/index.vue` | 发布文章 |
| `/article/list` | `views/article/list/index.vue` | 文章列表 |

## 6. 启动命令

```bash
# 开发模式
npm run dev

# 构建生产
npm run build

# 预览构建
npm run preview
```

## 7. 特性说明

- **RSA 加密登录**: 密码使用 RSA 公钥加密后传输，提升安全性
- **Element Plus UI**: 使用 Element Plus 组件库构建界面
- **Markdown 编辑**: 支持 Markdown 文章编辑
- **路由守卫**: 完整的登录认证和权限控制
- **Tailwind CSS**: 使用 Tailwind CSS 4 进行样式开发