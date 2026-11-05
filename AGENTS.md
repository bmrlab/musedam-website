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
