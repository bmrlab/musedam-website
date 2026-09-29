# 开放平台

入口：`/{lng}/developers/landing`。`/{lng}/developers` 重定向到概览。

沿用 Next.js App Router、站点头部和语言路由；开发者文档采用独立的三栏阅读布局。概览、导航及全部 17 篇技术文档提供中英文版本；英文路由使用独立英文正文、目录、搜索与复制内容。

## 内容维护

- `src/data/developers/content/*.mdx`：17 篇技术文档，服务端渲染。
- `src/data/developers/pages.json`：标题、分组、描述、目录与用于复制的 Markdown；改动正文后同步更新对应条目。
- `src/data/developers/content/en/*.mdx`、`pages.en.json` 和 `content.en.ts`：完整英文正文、元数据与注册表，修改文档时需同步维护。
- `src/data/developers/content.ts`：中文 MDX 组件注册表。
- `src/components/Developers`：导航、搜索、代码复制、目录、架构图及概览。
- `src/mdx-components.tsx`：避免 MDX 默认引入客户端 Context，使文档可服务端渲染。

新增章节时，注册 MDX 并添加 pages.json 条目。导航、上一篇/下一篇和 sitemap 自动使用注册数据。目录 ID 需要保持唯一且与正文标题顺序一致。

## 来源与编辑说明

整理于 2026-09-28：

- MuseDAM API 使用说明：https://tezign.feishu.cn/wiki/Co8kwU1I2iccDNkczxXcRBJonnc
- MuseDAM MCP API 对接文档：https://tezign.feishu.cn/wiki/PwBRwmLxgiScVpkeiGBcWd6HnEk
- 关联的第三方应用及组件对接：https://tezign.feishu.cn/wiki/M1GCw37stiGY8gkcsDxcGt28nzF
- 布局参考：https://musegea.com/developers/landing

保留开放 API 参数、返回字段、限制以及 MCP 17 个工具列表。示例 API Key、应用鉴权头、签名资源链接已脱敏。未嵌入含密钥的后台截图。以 HTML/CSS 重画接入架构、应用授权、组件通信及业务集成流程。

修正原文中撤销 API Key 示例误用 refresh 路径、成员接口域名漏斜杠、部分 curl 引号与语言标记，以及 MCP 工具级 region 与连接级配置的矛盾。组件示例动作名改为规范中的无空格形式。

原文未完整定义的 token 解密算法及 IV 不作推测，改为接入说明并要求获取完整协议。权限、QPS、单位差异及成功业务码差异保留说明。新增的服务端凭据存储、origin 校验、事件去重等为接入建议，不是额外的服务端能力承诺。

本地阅读页面不依赖 Payload 数据库。没有调用真实写入 API，也没有部署或修改原始飞书文档。

## 文档工具与更新时间

首页和文档标题下方提供「复制提示词」「复制为 Markdown」及最近更新时间。「复制提示词」先打开可预览的智能体提示词弹窗，提供复制提示词和复制页面 Markdown。提示词引导智能体先读文档索引及本页 Markdown，再按 API、第三方集成或 MCP 选择接入路径。复制内容的内部链接转换为站点绝对地址，部署时需正确配置 `SITE_SERVER_URL`。

各文档更新时间由 `pages.json`、`pages.en.json` 的 `updatedAt` 记录，首页日期在 `documents.ts` 中维护。本次初始修订日期为 2026-09-29；后续内容变更时同步更新对应日期，不使用请求时间或构建时间代替文档修订时间。

## 区域地址说明

Open API 国内为 `https://open.musedam.cc/api/muse`，海外为 `https://open.musedam.ai/api/muse`。应用管理 API 对应路径为 `/api/apps`。英文代码示例默认海外。

MCP 使用 `https://mcp-service.musedam.cc`，默认 cn 不带 query；海外添加 `?region=overseas`，Stdio 设置 `REGION=overseas`。不展示测试环境。

## 2026-09-29 对外字段范围确认

- 修改素材请求及素材响应统一使用 `score`；上传请求原有 `rating` 和检索条件 `ratings` 保持不变。
- 上传请求公开 `userId`；不展示 `bucket`、`storePath` 请求能力。公开文档按 URL 上传方式说明。
- 上传响应补充 `storePath`、`skippedDuplicateByEtag`；文件夹搜索补充 `currentUserId`、`folderIds`。
- 不新增通知渠道开关，也不发布审计中未覆盖的 25 个接口。审计报告是内部核对记录，不作为官网内容。
- GET/POST 转发约定本次不调整。

机器可读文档：`/{lng}/developers/llms.txt` 提供索引，`/{lng}/developers/markdown/{slug}.md` 提供纯 Markdown。两者均从公开文档数据生成，不依赖登录；不存在的文档返回 404。Markdown 文档中的文档链接指向对应的 Markdown 版本。

## 文档视觉规范

开放平台沿用官网 Euclid / PingFang SC 字体与黑色主按钮，文档主体使用中性灰白表面、深色正文、蓝色链接与交互强调。颜色集中维护于 `developers.css` 的 `--dev-*` 变量；参数表、代码块、业务流程和提示词浮层共享同一套色彩，不另设绿色主题。正文保持 15px，侧栏分组标题和导航保持 14px。

## 繁體中文

`zh-TW` 使用 `content/zh-TW/*.mdx`、`content.tw.ts` 和 `pages.tw.json`，不再复用简体正文。修改接口文档时同步维护三种语言及对应 JSON 的 Markdown/目录。繁体代码块与简体版本保持一致；后台操作截图保留原始界面语言。

公共界面文案通过 `localizeDeveloperText` 与 `ui.tw.json` 转换，新增简体文案时需补齐对应繁体词组。提示词、流程图、侧栏、目录及 `llms.txt` / Markdown 输出均随路由语言切换。繁体页面优先使用 PingFang TC / Microsoft JhengHei。
