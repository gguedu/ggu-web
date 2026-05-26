# GGU Web — 星河环球大学官网

基于 **Nuxt 4** 构建的星河环球大学（Galaxy Global University）官方网站，包含首页展示、文章系统和邮件服务。

## 技术栈

- **框架**: Nuxt 4 + Vue 3
- **UI**: Nuxt UI + Tailwind CSS 4
- **文章系统**: @nuxt/content v3
- **图标**: @iconify (Lucide / Simple Icons)
- **工具链**: pnpm, ESLint, TypeScript

## 项目结构

```
app/
├── assets/css/main.css        # 全局样式 + 文章排版
├── components/
│   └── AmbientOrbs.vue        # 首页背景光效
├── composables/
│   ├── useMailApi.ts           # 邮件 API 请求封装
│   ├── useMailState.ts         # 邮件全局状态管理
│   ├── useMailService.ts       # 邮件业务接口
│   └── useMailDrafts.ts        # 本地草稿管理
├── middleware/
│   └── mail-auth.ts            # 邮件模块鉴权中间件
├── pages/
│   ├── index.vue               # 首页
│   ├── joindosc.vue            # 入学申请（嵌入表单）
│   ├── post/
│   │   ├── index.vue           # 文章列表（分页）
│   │   └── [filename].vue      # 文章详情
│   ├── mail.vue                # 邮件模块布局（侧边栏）
│   └── mail/
│       ├── login.vue           # 登录 / 注册
│       ├── index.vue           # 收件箱
│       ├── message.vue         # 邮件详情
│       ├── compose.vue         # 写邮件
│       ├── sent.vue            # 已发送
│       ├── drafts.vue          # 草稿箱
│       ├── starred.vue         # 星标邮件
│       └── settings.vue        # 账户设置
└── types/
    └── mail.ts                 # 邮件相关类型定义
content/
└── post/                       # Markdown 文章目录
```

## 功能模块

### 首页
- 响应式 Hero 区域，带鼠标跟随光效
- 导航栏滑动指示器动画
- 页面切换过渡动画

### 星河文库
- 基于 @nuxt/content 的 Markdown 文章系统
- 分页列表 + 文章详情页
- 支持代码高亮（Shiki）、表格、折叠块等

### 邮件系统
- 多账户管理，支持 Gravatar 头像
- 收件箱 / 已发送 / 草稿箱 / 星标邮件
- 写邮件（支持附件、回复）
- 本地草稿存储
- 自动刷新（可配置间隔）
- 账户设置（修改用户名、密码、注销）

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 代码质量

```bash
# ESLint 检查
pnpm lint

# OxLint 检查
pnpm lint:oxlint

# TypeScript 类型检查
pnpm typecheck

# 格式化
pnpm fmt
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NUXT_PUBLIC_MAIL_API_BASE_URL` | 邮件 API 地址 | `http://127.0.0.1:8787/api` |

## 部署

项目配置了 Cloudflare Workers（`wrangler.toml`），也可部署到 Vercel 等平台。

## License

MIT
