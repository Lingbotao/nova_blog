## 项目介绍

本项目旨在提供一套在线一键搭建动态博客的能力，项目中包含（后台后端 + 后台前端）了全栈代码。创建这个项目是为了快速给另外一个项目提供服务，很多功能和架构可能考虑不完善；后期会进行优化和重构，待优化内容可以查看[TODO](#TODO)。项目的技术选型和功能方案如下：

- 前端：Vue3 + Vue-router + pinia + TypeScript + tailwindcss
- 后端：expressjs + Nodejs
- 数据库：mysql
- 鉴权方案：
  - **登录链路**：前端用后端返回的 RSA 公钥（PKCS1_OAEP, SHA-256）加密用户名密码，HTTPS 下传输，后端用 RSA 私钥解密
  - **会话链路**：JWT（HS256 + 环境变量 `JWT_SECRET`），前端 `Authorization: Bearer <token>` 提交
- 功能：上传、下载、富文本编辑预览、博客上线&下线、博客排序、搜索、软删除
- 富文本编辑器：md-editor-v3
- 包管理：pnpm（monorepo 工作区）
- 部署：nginx

### 目录结构
- monorepo
```shell
nova-blog
├── scripts          # 脚本目录（MySQL 初始化脚本、部署文档）
├── nova-blog-admin  # 前端模块
└── nova-blog-server # 服务端模块
```
- 前端模块
```shell
./nova-blog-admin
├── public       # 静态公共文件
├── docs         # 项目文档
└── src
    ├── api             # 接口目录
    ├── assets          # 资源目录
    ├── hooks           # 钩子函数
    ├── router          # 路由
    │   ├── guard.ts    # 路由守卫
    │   ├── index.ts    # 路由入口
    │   └── routes.ts   # 路由配置
    ├── store           # pinia状态配置
    │   └── modules     # 状态模块
    ├── types           # typescript接口
    └── utils           # 公共函数（server/encrypt/index）
    └── views           # 页面代码
        ├── article     # 文章管理
        │   ├── list    # 文章列表（已实现）
        │   └── publish # 发布文章（已实现）
        ├── home        # 首页
        │   ├── dashboard      # 仪表盘
        │   ├── error-page     # 错误页
        │   └── login          # 登录页
        └── layout      # 页面布局
            ├── sidebar # 侧边栏
            └── index   # 布局入口
```
> 主要组件官网：[element-plus](https://element-plus.org/zh-CN/)、[md-editor-v3](https://imzbf.github.io/md-editor-v3/zh-CN/)

- 后端模块
```shell
./nova-blog-server
├── keys               # RSA 密钥文件（运行期自动生成，已被 .gitignore 排除）
├── middleware         # 中间件（auth.js JWT 鉴权）
├── router             # 路由
│   ├── auth.js        # 登录/获取公钥
│   ├── blog.js        # 博客 CRUD（list/create/update/delete/detail/upload/uploadImage）
│   └── common.js      # 公共接口（图片下载）
├── utils              # 工具函数
│   ├── SQLPool.js     # MySQL 连接池（query/insert/update/remove）
│   ├── auth.js        # 认证工具（RSA 解密）
│   └── crypto-text.js # 加密工具
├── .env.example       # 环境变量模板（入 Git）
├── app.js             # 应用入口（顶层 await，先 dotenv 再 dynamic import 业务模块）
└── jsconfig.json
```

### 前端路由
| 路径 | 组件 | 鉴权 |
|---|---|---|
| `/login` | `views/home/login/index.vue` | 否 |
| `/home` | `views/layout/index.vue`（默认仪表盘） | 是 |
| `/article/publish` | `views/article/publish/index.vue` | 是 |
| `/article/list` | `views/article/list/index.vue` | 是 |
| `/404` | `views/home/error-page/404.vue` | 否 |

### 接口列表

#### 公共接口（无需鉴权）
| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | `/v1/getPubKey` | 获取 RSA 公钥（用于前端加密登录信息） |
| POST | `/v1/login` | 登录（用户名密码 RSA 加密传输） |
| GET  | `/v1/common/download?image_id=xxx` | 图片下载（从 image_source 表查询） |

#### 博客接口（需要 JWT 鉴权）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/v1/blog/list` | 文章分页列表，支持按标题模糊搜索，自动过滤软删除记录 |
| POST | `/v1/blog/detail` | 获取文章详情 |
| POST | `/v1/blog/create` | 创建文章（自动写入 is_deleted=0 软删除标志） |
| POST | `/v1/blog/update` | 更新文章（基于 id 条件，支持部分字段更新） |
| POST | `/v1/blog/delete` | 删除文章（软删除，更新 is_deleted=1） |
| POST | `/v1/blog/upload` | 上传 markdown 文件 |
| POST | `/v1/blog/uploadImage` | 上传图片（写入 image_source 表，返回 resourceUrl） |

### 数据库表结构

- `article` - 文章表：id、title、desc、content、type、status、is_top、is_deleted、create_at、update_at、article_id (BINARY(16))
- `user_auth` - 登录账号表：username、password、login_type、is_super 等
- `user_info` - 用户信息表
- `image_source` - 图片资源表：img_url、img_name、img_type、img_size、img_id (BINARY(16))
- `operation_log` - 操作日志表

### 安全与配置说明

- `.env` **不会**入 Git（已被 `.gitignore` 忽略），`nova-blog-server/.env.example` 是模板。
- `nova-blog-server/keys/*.pem` 是 RSA 密钥对，运行期自动生成；**不会**入 Git。
- 首次启动服务时如缺失密钥，`utils/auth.js` 会自动生成 2048 位 RSA 密钥对到 `keys/` 目录。
- 生产环境 JWT 密钥必须用环境变量 `JWT_SECRET`，**不要**使用 RSA 私钥或占位字符串。

### 项目启动

- 环境准备
NodeJS: ^22.13.0、pnpm（10.x）、MySQL 8.x

- 初始化数据库
```bash
# 导入脚本目录下的 SQL 文件
mysql -u root -p < scripts/mysql/blog_common.sql
# 开发/生产环境授权脚本已改为注释模板，按需启用（详见文件内说明）
```

- 配置环境变量
复制 `nova-blog-server/.env.example` 为 `nova-blog-server/.env`，按需修改：

```bash
# Server
EXPRESS_APP_PROT=3000

# 上传目录（相对/绝对路径均可）
UPLOAD_DESTINATION=./nova-blog-server/public/uploads

# Database configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=nova_blog

# JWT 签名密钥（HS256，必须为长随机字符串）
# 生成方式：
#   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=
```

- 启动项目
```bash
# 安装依赖
pnpm install
# 启动前端
pnpm run dev:admin
# 启动后端
pnpm run start:server
```