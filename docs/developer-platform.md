# 开放平台

入口：`/{lng}/developers/landing`。`/{lng}/developers` 重定向到概览。

沿用 Next.js App Router、站点头部和语言路由；开发者文档采用独立的三栏阅读布局。概览、导航及全部 20 篇技术文档提供中英文版本；英文路由使用独立英文正文、目录、搜索与复制内容。

## 内容维护

- `src/data/developers/content/*.mdx`：20 篇技术文档，服务端渲染。
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

Open API 国内为 `https://open.musedam.cc/api/muse`，海外为 `https://open.musedam.ai/api/muse`。应用管理 API 对应路径为 `/api/apps`。

MCP 使用 `https://mcp-service.musedam.cc`，默认 cn 不带 query；海外添加 `?region=overseas`，Stdio 设置 `REGION=overseas`。不展示测试环境。

页面只显示当前部署区域的地址，按 `DEPLOY_REGION` 判断：`global` 为海外，其余为国内。三种语言在同一区域显示同一套域名。

- 统一入口为 `src/data/developers/region.ts`：`getDeveloperRegion()` 读环境变量，`regionalizeDeveloperText()` 把文本中的 `open.musedam.*`、`musedam.*`（不含 `www`）和 MCP 根地址换成当前区域。
- 替换覆盖正文代码块、行内代码、链接、顶部 Base URL 框、首页接入示例、复制为 Markdown 和 `/markdown/{slug}.md`。普通段落文字不做替换，域名请写在行内代码或链接里。
- 正文和 `pages*.json` 可写任意一个区域的域名，但不要写「国内为 X，海外为 Y」这类同时列出两个区域的句子。MCP 的 `region` 参数可选值属于参数说明，保留。
- 环境变量只能在服务端读取，客户端组件（如 `ConnectionExample`）由服务端传入 `region`。
- 商品库只在国内提供：`product-library` 页面固定按国内区域渲染，不做替换，始终显示 `https://open.musedam.cc/api/muse/product-api`。

## 2026-09-29 对外字段范围确认

- 修改素材请求及素材响应统一使用 `score`；上传请求原有 `rating` 和检索条件 `ratings` 保持不变。
- 上传请求公开 `userId`；不展示 `bucket`、`storePath` 请求能力。公开文档按 URL 上传方式说明。
- 上传响应补充 `storePath`、`skippedDuplicateByEtag`；文件夹搜索补充 `currentUserId`、`folderIds`。
- 不新增通知渠道开关，也不发布审计中未覆盖的 25 个接口。审计报告是内部核对记录，不作为官网内容。
- GET/POST 转发约定本次不调整。

机器可读文档：`/{lng}/developers/llms.txt` 提供索引，`/{lng}/developers/markdown/{slug}.md` 提供纯 Markdown。两者均从公开文档数据生成，不依赖登录；不存在的文档返回 404。Markdown 文档中的文档链接指向对应的 Markdown 版本。

## 2026-10-12 外部系统嵌入组件

新增 `embed`（外部系统嵌入组件）文档，位于「第三方集成」分组，与 `components`（第三方应用嵌入 MuseDAM）方向相反：客户在自有系统中通过 iframe 打开 `/outer/embed` 调用 MuseDAM 组件。

- 来源：后端仓库 `docs/外部系统嵌入组件-接口需求.md`，前端仓库 `components-outer/README.md` 的 OuterEmbed 一节及 `components-app/README.md`。鉴权以接口需求文档为准（团队 API Key 签发一次性 code），不使用 README 中旧的 `/auth/code` 说明。
- 签发接口对外写作 `https://open.musedam.cc/api/muse/embed-code`（公网 `/api/muse/{method}` 经网关进入 open-service），嵌入页写作 `https://musedam.cc/outer/embed?code=...`。
- 未公开内部实现：表结构、Redis key、open_service 登记、兑换接口和 settings 内部路由。
- 组件截图来自飞书「第三方应用及组件对接」原图，存放于 `public/assets/developers/embed/`；成员截图已打码。管理员开启嵌入的设置页尚无截图。
- 接口仍在开发中，字段或错误码变化时需同步三种语言的 MDX 和 `pages*.json`。

## 文档视觉规范

开放平台沿用官网 Euclid / PingFang SC 字体与黑色主按钮，文档主体使用中性灰白表面、深色正文、蓝色链接与交互强调。颜色集中维护于 `developers.css` 的 `--dev-*` 变量；参数表、代码块、业务流程和提示词浮层共享同一套色彩，不另设绿色主题。正文保持 15px，侧栏分组标题和导航保持 14px。

## 繁體中文

`zh-TW` 使用 `content/zh-TW/*.mdx`、`content.tw.ts` 和 `pages.tw.json`，不再复用简体正文。修改接口文档时同步维护三种语言及对应 JSON 的 Markdown/目录。繁体代码块与简体版本保持一致；后台操作截图保留原始界面语言。

公共界面文案通过 `localizeDeveloperText` 与 `ui.tw.json` 转换，新增简体文案时需补齐对应繁体词组。提示词、流程图、侧栏、目录及 `llms.txt` / Markdown 输出均随路由语言切换。繁体页面优先使用 PingFang TC / Microsoft JhengHei。

## Product Library API documentation (2026-10-14)

Product Library API is one article in the existing Open API navigation group,
at `/{lng}/developers/product-library`, in Simplified Chinese, English and
Traditional Chinese. It combines authorization, shared request conventions and
all 28 operations, organized by resource. Keep endpoint parameters and independent
curl examples visible. Reuse shared field tables and put response examples and
less common details in labeled disclosures. Do not recreate separate overview,
reference, examples or guide pages for this API.

The seven retired article routes and their Markdown routes redirect to this
single document. Navigation, search, the document index and sitemap contain only
the canonical article. Product Library endpoint banners and table formatting are
selected by document slug, independently of the navigation group.

The original resource schemas come from `bmrlab/musedam-product-library` commit
`01574a8aeede7682e4e172526367703d05c0e14c`:

- `docs/open-api/openapi.json`: the English contract, including 17 paths,
  31 operations and 71 schemas.
- `docs/open-api/*.md`: English guides.
- `src/app/developers/open-api/content/zh-CN/`: Chinese guides and the
  description-only OpenAPI localization overlay.

All 28 public services use `POST https://open.musedam.cc/api/muse/product-api`.
Authenticate with the user's MuseDAM API Key in
`Authorization: Bearer <APIKEY>`. Set `Content-Type: application/json` and send
`service` (the original operationId) and all business parameters as sibling body
fields. Resource IDs, pagination and filters are not URL parameters. The public
caller supplies no separate team or caller identity. Do not publish internal
service credentials or internal routes. Do not apply
the asset API's region banner, rate-limit policy or response envelope here.

The public product API provides no file-download, export or download-candidate
selection operations. Keep `listProductDownloads` for team history, including
existing API key records. Product reads retain signed `downloadUrl` and
`downloadUrlExpiresAt` fields under current authorization. Browser, member and
share downloads and exports are unchanged. Keep this scope synchronized in all
three Product Library MDX articles, their `pages*.json` Markdown mirrors and the
downloadable OpenAPI contract.

The downloadable contract is served at
`/assets/developers/product-library/openapi.json`. Its API shapes and examples match
the source implementation. Descriptions and examples from the source contract have
been corrected against that implementation, including item reads, template system
fields, category paths, nullable custom media and mutation results. The public
contract has one POST operation with 28 named request variants selected by a
`service` discriminator. `responses` describes the public gateway contract:
HTTP 200 for successful operations, including creation, and handled failures.
Success has outer `code: "0"`, `result.success: true`, and `result` contains
`data`, `code: null`, `message: null`, `requestId`, and optional `pagination`.
Use `"OK"` in public success examples, but do not constrain message wording.
Handled gateway errors have a nonzero string `code` and `result: null`;
observed codes include `MB100005` for upstream failures and `MO100002` for
invalid credentials. Do not parse diagnostic text or embedded JSON in `message`.
Preserve the response `traceId`, which may differ from a submitted trace ID.
Do not promise forwarding of `Retry-After` or `X-Request-Id` headers.
`x-services` retains per-service permissions, roles and internal responses;
`x-internal-responses` retains aggregated internal examples for troubleshooting.
These internal statuses and envelopes are not the public gateway contract.
For uncertain writes, reconcile state before retrying; an internal
`mutation_response_unavailable` means the mutation committed and must not be repeated.
The reference includes
all services and links to concise field tables in the same article.
Full schemas and shared response, header and parameter definitions remain in the
downloadable contract; do not render these raw OpenAPI components or appendices
on the documentation page.

Match the existing Open API articles (`search.mdx` and `assets.mdx`) when editing
the reference: endpoint, method, description, request parameters, response fields,
then curl and expandable response examples. Keep the Product Library response shape;
do not substitute the asset API envelope. Explain necessary nested fields in
short tables and link directly to those sections. Link to the same article's error
handling section for status codes and to the OpenAPI download for complete
machine-readable definitions.

Keep public examples short and independent: a complete URL, an explicit
`your_api_key` placeholder, representative resource IDs, and the request body.
Explain placeholders in prose. Do not require shell setup, helper functions,
temporary files, command-line JSON processors, or test assertions to read an example.

When refreshing these documents:

1. Compare source routes, validators and response serializers with the OpenAPI
   contract, then refresh the public JSON and all three localized articles. Resolve
   conflicting descriptions and examples against the implementation; do not
   reintroduce the source contract's known documentation errors. Keep schema
   identifiers, fields, enums and code samples unchanged across locales.
2. Update the localized MDX, matching `pages*.json` Markdown and heading metadata,
   and `updatedAt` together. Preserve the explicit anchors in copied Markdown so
   cross-document links keep working outside the rendered site.
3. Keep the current authentication model: an existing MuseDAM API key, explicitly
   added as an API Key Collaborator, with permissions derived from its role.
   Product Library does not issue keys or offer per-key operation selection.
4. Exclude internal rollout notes, database maintenance procedures and unpublished
   backend proposals. Use the confirmed API service URL in examples and keep
   document URLs separate from API request URLs.
5. Validate MDX compilation, registry and heading consistency, document links,
   localized page rendering, search, Markdown routes and the downloadable contract.
   Run scoped `pnpm lint --file ...` and `pnpm exec tsc --noEmit --incremental false`.

Documentation verification does not establish that the public gateway forwards to
this source snapshot. No authenticated production API requests or database
operations are needed to build or read these pages.

## 2026-10-21 异步上传

依据内部 API 文档的 2.1、2.2 节（https://tezign.feishu.cn/wiki/D7kvwZORMiF4pCkMEWZcjjDnned），并核对后端 DTO、任务实现与 `000104.sql` 网关配置，在三种语言的素材管理页新增：

- `POST /upload-assets-async`：URL 异步上传，单次最多 50 条，任务复用、失败重试及可选回调。
- `POST /upload-assets-task`：任务归属校验、阶段、进度、字节数及成功/失败结果。

同步维护目录、搜索描述、复制 Markdown 和文档日期。对外仅介绍 URL 上传，不说明内部存储路径上传方式或相关请求限制；响应字段保持完整。英文示例使用海外 Base URL。
