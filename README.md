# GGU Web — 星河环球大学官网

基于 **Nuxt 4 / Vue 3** 构建的星河环球大学（Galaxy Global University）官方网站。项目包含主站首页、星河文库、星河通行证邮箱界面、服务中心，以及接入 GGU DNS 分发平台的用户前台。

## 技术栈

- **框架**：Nuxt 4 + Vue 3 Composition API
- **语言**：TypeScript
- **样式**：Tailwind CSS 4 + Nuxt UI 4
- **内容系统**：@nuxt/content v3
- **图标**：Iconify（Lucide / Simple Icons）
- **动画/交互**：Vue Transition、CSS backdrop blur / glassmorphism、项目内自定义过渡
- **包管理器**：pnpm

> 本项目统一使用 `pnpm`，不要使用 `npm`。

## 功能模块

### 首页

- 黑色画布 + 环境光效背景
- 响应式 Hero 展示
- 页眉胶囊导航与滑动指示器
- 页面切换过渡动画

### 星河文库

- 基于 `@nuxt/content` 的 Markdown 内容系统
- 文章列表与详情页
- 支持代码高亮、表格、折叠块等常用 Markdown 内容

### 星河通行证 / 邮箱

- 邮箱登录 / 注册
- 多账户管理
- 收件箱、已发送、草稿箱、星标邮件
- 写邮件与附件
- 本地草稿
- 账户设置、修改密码、注销账户

### DNS 分发平台用户前台

集成在服务中心中，使用 `ggudnsapi` 后端。

- 复用 GGU 通行证登录态：`localStorage.mail_token`
- 请求 DNS API 时通过 `Authorization` 请求头携带 token
- 无 Cookie 登录态
- 支持：
  - 查看账户邮箱、DNS UID、积分
  - 查看我的解析记录
  - 新建解析记录
  - 启用 / 停用解析
  - 删除解析
  - “兑换积分”UI 占位
- 新建解析时，记录类型下拉框从后端 `/api/records/meta` 获取，只展示后台允许的类型

## 项目结构

```text
app/
├── app.vue                         # 根布局、页眉导航、页面过渡、全局背景
├── assets/css/main.css             # 全局样式 + 文章排版
├── components/
│   ├── AmbientOrbs.vue             # 全局环境光效
│   ├── FloatingLoginModal.vue      # 可复用悬浮通行证登录窗口
│   └── services/
│       └── DnsDashboard.vue        # DNS 分发平台用户前台
├── composables/
│   ├── useMailApi.ts               # 邮件 API 请求封装
│   ├── useMailState.ts             # 通行证/mail token 与用户状态
│   ├── useMailService.ts           # 邮件业务 API
│   ├── useMailDrafts.ts            # 本地草稿
│   ├── useDnsApi.ts                # DNS API 请求封装
│   ├── useDnsService.ts            # DNS 业务 API
│   └── useFloatingLogin.ts         # 悬浮登录窗口状态
├── middleware/
│   └── mail-auth.ts                # 邮件模块路由鉴权
├── pages/
│   ├── index.vue                   # 首页
│   ├── joindosc.vue                # 入学申请嵌入页
│   ├── services.vue                # 服务中心 / DNS 用户前台入口
│   ├── post/
│   │   ├── index.vue               # 星河文库列表
│   │   └── [filename].vue          # 文章详情
│   ├── mail.vue                    # 邮箱模块全屏布局
│   └── mail/
│       ├── login.vue               # 通行证登录 / 注册
│       ├── index.vue               # 收件箱
│       ├── inbox.vue               # 收件箱子页
│       ├── message.vue             # 邮件详情
│       ├── compose.vue             # 写邮件
│       ├── sent.vue                # 已发送
│       ├── drafts.vue              # 草稿箱
│       ├── starred.vue             # 星标邮件
│       └── settings.vue            # 账户设置
└── types/
    ├── mail.ts                     # 邮件相关类型
    └── dns.ts                      # DNS 分发平台相关类型

content/
└── post/                           # Markdown 文章目录
```

## 本地开发

### 安装依赖

```powershell
pnpm install
```

### 启动开发服务器

```powershell
pnpm dev
```

默认由 Nuxt 启动本地开发服务，具体地址以命令输出为准。

### 类型检查

```powershell
pnpm typecheck
```

### 代码检查与格式化

```powershell
pnpm lint
pnpm lint:oxlint
pnpm fmt:check
pnpm fmt
```

### 构建与预览

```powershell
pnpm build
pnpm preview
```

## 环境变量

Nuxt public runtime config 使用 `NUXT_PUBLIC_*` 注入。

| 变量 | 说明 | 默认值 / 备注 |
|---|---|---|
| `NUXT_PUBLIC_MAIL_API_BASE_URL` | cloud-mail API 地址 | 未配置时前端封装默认使用 `http://127.0.0.1:8787/api` |
| `NUXT_PUBLIC_MAIL_FORWARDING_API_BASE_URL` | 邮箱转发服务 API 地址 | 转发功能使用 |
| `NUXT_PUBLIC_DNS_API_BASE_URL` | DNS 分发平台 `ggudnsapi` API 地址 | 未配置时默认使用 `http://127.0.0.1:8787/api` |

示例：

```powershell
$env:NUXT_PUBLIC_MAIL_API_BASE_URL = "https://mail.ggu.edu.kg/api"
$env:NUXT_PUBLIC_DNS_API_BASE_URL = "http://127.0.0.1:8787/api"
pnpm dev
```

## 登录态说明

GGU Web 目前复用 cloud-mail 的通行证登录态：

- token 存储 key：`localStorage.mail_token`
- 请求头：`Authorization: <token>`
- token 内容不自动加 `Bearer ` 前缀
- 旧版 `localStorage.token` 会在 `useMailState.ts` 中迁移到 `mail_token`

DNS 分发平台前台也复用这个 token。用户在 `/services` 中打开 DNS 服务时：

1. 如果已有 `mail_token`，前端调用 `ggudnsapi` 的 `/api/auth/callback` 或 `/api/auth/me` 校验登录态。
2. 如果没有 token，显示 `FloatingLoginModal.vue` 悬浮登录窗口。
3. 登录成功后 token 写入 `localStorage.mail_token`，DNS 前台继续加载账户与解析数据。

## DNS 分发平台联调

DNS 前台依赖兄弟项目 `ggudnsapi`。

推荐本地联调流程：

1. 启动 `ggudnsapi` Worker：

```powershell
pnpm --dir "E:\GithubDev\GGU\ggudnsapi" dev
```

2. 启动 GGU Web：

```powershell
$env:NUXT_PUBLIC_DNS_API_BASE_URL = "http://127.0.0.1:8787/api"
pnpm dev
```

3. 打开 `/services`。
4. 点击 DNS 分发平台的“立即前往”。
5. 如果未登录，使用悬浮登录窗口登录 GGU 通行证。
6. 登录后检查：
   - 账户邮箱、UID、积分是否显示
   - `/api/records/meta` 是否返回开放域名池
   - 记录类型下拉框是否只显示后台允许的类型
   - 新建 / 启停 / 删除解析是否符合后端返回结果

## 测试建议

### 静态检查

当前最基础的验证：

```powershell
pnpm typecheck
```

### 前端手动检查

- 页眉是否显示“服务”
- `/services` 是否正常打开
- 服务列表切换是否有过渡动画
- DNS“立即前往”是否展开 DNS 控制台
- 未登录时是否弹出悬浮登录窗口
- 登录成功后是否复用 `localStorage.mail_token`
- DNS 控制台是否能加载用户、积分、解析记录

### 与 ggudnsapi 的端到端检查

需要先在 `ggudnsapi` 后台配置：

1. 管理员邮箱 `DNS_ADMIN_EMAILS`
2. Cloudflare 账户
3. 开放域名池
4. 允许的解析类型
5. 初始积分配置

然后在前端测试：

- 创建允许类型的解析应成功并扣积分
- 创建未开放类型的解析应被拒绝
- 积分不足时应被拒绝
- 删除解析默认不退积分
- 启停解析不重复扣积分

## 部署

构建生产版本：

```powershell
pnpm build
```

部署方式根据当前托管平台决定。若 DNS 前台部署到生产环境，需要配置：

```text
NUXT_PUBLIC_DNS_API_BASE_URL=https://<ggudnsapi-domain>/api
```

同时确保 `ggudnsapi` 的 `ALLOWED_ORIGIN` 与 GGU Web 生产域名一致。

## 相关项目

- `ggudnsapi`：Cloudflare Worker 后端，提供 DNS 分发 API 与管理后台。
- `cloud-mail` / 邮件 API：提供 GGU 通行证登录态与用户信息。

## License

MIT
