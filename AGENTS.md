# MuseDAM 官网与 CMS：本地启动与开发

本文件用于进入本地开发。命令默认在本文件所在目录执行；核对日期：2026-11-05。已对照目标主分支源码、配置和脚本静态核对，未实际启动服务。

## 环境与配置

Node.js >=20.9，pnpm 9.12.1，以 packageManager 为准。使用 Next.js + Payload CMS，数据库是 PostgreSQL（src/payload.config.ts 的 postgresAdapter）。

```sh
test -f .env || cp .env.example .env
```

至少配置 DATABASE_URI、PAYLOAD_SECRET、站点地址，媒体功能还需 S3 和对应应用 API。根 docker-compose.yml 的 payload 镜像仍为 Node 18，低于当前 engines；本地优先按上述 Node 版本运行。可按 compose 配置只启动 postgres，并先检查 5432 端口及数据库连接是否匹配。

## 安装与首次数据库准备

```sh
pnpm install
```

确认指向本地开发库后，按 README 应用已有 Payload migration：

```sh
pnpm payload migrate
```

seed 会写入内容数据，只在明确需要初始化时阅读 src/seeds/index.mjs 后执行，不作为每次启动步骤。

## 启动

```sh
pnpm dev
```

默认 http://localhost:3000，后台通常在 /admin，以项目配置为准。并行启动可用 `pnpm dev --port 3001`。官网部分 auth/home/detail/share/login/profile/settings 路由受部署 nginx 重写影响，本地 Next 路由不等同生产跳转，详见 README。

## 开发入口与验证

src/app 为页面；src/payload.config.ts 和相关 collection 为 CMS；src/app/i18n 为多语言；public/assets 为现有素材。先复用站内组件、布局和素材。

配置变动可运行 `pnpm generate:types` / `pnpm generate:importmap` 中实际相关的一项。当前 lint 为 next lint，先核对 Next 版本兼容性；没有统一 test/typecheck 脚本。手动验证目标语言路由、CMS 数据与图片读取。

## UI 开发约定

MuseDAM 界面按 `muse-development/references/design-system.md`（由工作区 Muse 开发 skill 提供）；新增静态样式使用 Tailwind，先复用本项目组件与图标。两种主题均需适配。跨仓定位见 工作区 `muse-development/SKILL.md`。

## 启动完成的判断与维护

以终端实际输出的监听地址为准，并验证数据库连接、认证和当前开发的主要流程；编译成功不代表外部依赖已可用。配置模板仅用于首次创建文件，不覆盖已有配置，不把凭据写入本文。数据库准备命令仅用于已确认的本地开发库。脚本、环境入口、端口或目录结构变化时，同步维护本文件。

## Demo 原型目录（/demo-app）

- 列表、上传与查看器：`src/app/demo-app`。`catalog.ts` 根据旧路径映射模块；新上传路径保存一级目录、模块及 SKU。原型按模块内同名/版本去重，旧文件链接保留。
- SKU 初始数据：`src/app/demo-app/skus.json`，来源为飞书产品价格库 `SulEwq05BilPvKkAWGFcOsPEnWh` 的「产品价格库（SKU）」工作表，2026-11-18 核对；目录分类结合产品方案会话 `GIGqwqXBwilvUjkxsoxcR4PKnK4`。只存模块和 SKU，不复制价格、客户信息。
- 这些 Route Handler 返回独立 HTML；样式使用专用 Tailwind 输入 `styles.css` 和 `tailwind.demo.config.cjs`，由 `pnpm demo:styles` 生成 `public/demo-catalog.css`。`pnpm dev` / `pnpm build` 已自动先生成样式；开发中新增类名后重新执行 `pnpm demo:styles`。
- 权限：Muse 销售可查看及编辑；POD 销售只读目录，不显示上传和编辑入口，上传页及保存接口拒绝访问。角色以会话 `isSale` 与 `businessRoles` 判断；同时拥有两种角色时可编辑。独立原型链接允许匿名访问；目录和带标题查看器仍按各自登录权限控制。独立 HTML 响应使用 CSP sandbox（不授予 allow-downloads），禁止页面触发下载，不开放 ZIP/Office 等下载文件；这无法阻止浏览器保存源码、截图或直接抓取响应。
- 隔离验证：`node tests/demo-app.cjs`。交互预览：`node tests/demo-app.cjs --serve` → http://localhost:3101/demo-app。该独立测试进程模拟会话与 S3，不连接真实账户或线上存储；默认使用 `~/Downloads/交互原型`，可用 `DEMO_FIXTURE_DIR` 指定其他本地 HTML 目录。内存上传数据在进程退出后清空。
- 真正的 Next 开发入口仍为 `pnpm dev --port 3100` → http://localhost:3100/demo-app，需要有效会话及 S3 配置；隔离预览通过不代表真实存储/登录联调已通过。

- 模块状态：`已上线` / `路线图中`，路线图可选填预计上线日期。初始状态参考 SKU 表（已发布 → 已上线，其余 → 路线图中）；无 SKU 的模块默认路线图中，日期不推测。可在上传页单独保存模块信息，按模块写入 S3 `demo-app/.modules/<sha256>.json`，覆盖初始值但不改动原 HTML 路径。
- 原型预览：点击列表名称使用原生全屏 dialog + iframe，支持关闭按钮与 Esc，关闭后保留目录筛选、滚动和焦点；复制链接及独立打开均指向匿名原型地址。
- 原型目录视觉：按用户提供的生产页截图使用深海军蓝背景、蓝灰面板、彩色渐变模块图标，保留紧凑列表；蓝色主操作，绿色/琥珀色区分上线状态。主题变量位于 `styles.css`，上传页与查看器共用，不改动原型 HTML 内部样式。
- 模块图标：`module-icons.ts` 内精选素材库 SVG，来源见同目录 `icon-sources.md`。上传页支持自动匹配或选择内置图标；持久化 `module.icon` ID，与模块状态共用 `.modules` 元数据，不写任意 SVG。主目录、卡片、模块标题和查看器共用映射。

- 链接原型：添加页支持“上传 HTML / 填写链接”，链接需填写名称和 HTTP(S) 地址，沿用模块、SKU、状态与图标。地址存为对应模块路径下的 `<名称>.url.json`；同模块同名链接覆盖，HTML 与链接分别保留。列表预览直接嵌入目标 URL，复制与独立打开使用原地址；目标站的登录及 iframe 限制仍由目标站决定，外部站点不受本服务 HTML sandbox 的下载限制。链接元数据不通过匿名原型路由公开。
