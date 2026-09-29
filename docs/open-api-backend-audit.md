# 开放接口文档与后端代码核对

核对日期：2026-09-29。依据本地后端代码与网站当前中英文 MDX；没有请求真实业务 API、修改后端或调整对外开放范围。

按用户说明，GET/POST 经 open-service 转发处理，**不列为本次文档修改项**。

## 范围和结论

对照企业素材、文件夹订阅、用户团队、第三方应用四个服务接口，共 65 个方法路径；页面正文覆盖 40 个，另外 25 个未找到对应章节。这里统计的是后端方法，不代表 65 个都已上线或都应公开。另发现特征接口和旧版个人素材接口，单独列出，不混入企业接口计数。

存在实际字段错误与文档遗漏，不能将这些遗漏解释为有意不开放。之前页面依据飞书资料整理，并未与这份后端逐项核对；已明确主动移除的是示例凭据、签名链接，以及用户要求移除的 MCP 测试环境，不是业务接口白名单。

## 已确认的字段差异

| 接口/结构 | 当前页面问题 | 后端定义与建议 |
|---|---|---|
| `/modify-assets` 请求 | 使用 `score`，遗漏 `metadatas` | 评分字段为 `rating`；元数据用 `metadatas: [{name, value}]`。上传元数据用 fieldId，修改用 name，不能混用 |
| 素材返回 DTO | 搜索字段表、搜索/修改/批量获取示例中存在 `score` | `MiniDamMaterialDTO` 定义为 `rating`；搜索转换实现显式从内部 score 写入 rating |
| 素材返回 DTO | 未说明 `metadataList` | 类型 JSONObject；需团队开启自定义元数据且存在记录。不同接口的转换路径不完全相同，不宜承诺所有响应都填充该字段 |
| `/upload-assets` 请求 | `url` 标为无条件必填 | 与 `storePath` 二选一；同时传时 storePath 优先，url 被忽略 |
| `/upload-assets` 请求 | 缺少 `storePath`、`bucket`、`userId` | 分别为已上传 OSS key、源 bucket、素材所有者；userId 省略时使用创建者。bucket 只在 storePath 存在时生效 |
| `/upload-assets` 请求 | 缺少自动化控制 | `skipAutomationInbound`、`skipAutomationInboundCompleted` 默认不跳过；`triggerAutomationInbound` 已废弃，应只列兼容说明 |
| `/upload-assets` 返回 | assets[] 缺字段 | `storePath`、`skippedDuplicateByEtag`；查重命中时引用已有素材 |
| `/search-folders` 请求 | 缺字段 | `currentUserId`、`folderIds`；指定 folderIds 时走按 ID 查询分支，不是普通关键字分页查询 |
| `/enterprise-tag-list` 请求 | 缺字段 | `needMaterialCount`，默认 false |
| `/query-tag-tree` 返回 | 未完整列出排序字段 | 树节点 DTO 有 `sort`，除 id/name/children 外应说明 |
| `/material-automation-subscribe` 请求 | 缺少配置对象 | `config`，例如 MATERIAL_VALIDITY_CHANGED 的 expireAdvanceDays、effectiveAdvanceDays；解释依版权管理开关而异 |
| `/add-in-app-notify` 请求 | 缺少发送渠道开关 | `inAppNotify`、`feishuNotify`，默认均为 true |
| `/org-info` 返回 | 示例未覆盖字段 | `featureLibrary`（特征库开关） |
| `/org-member-info` 请求/返回 | 未说明脱敏选项与联系字段 | 请求 `maskPhone` 默认 true；响应 `phone`、`email`。false 返回真实手机号的能力需确认对外授权政策，不能因代码支持就扩大文档承诺 |

### 代码证据

- [MaterialModifyReq](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/enterprise/MaterialModifyReq.java:28)
- [MetadataDTO](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/enterprise/MetadataDTO.java:9)
- [MiniDamMaterialDTO](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/MiniDamMaterialDTO.java:58)
- [EnterpriseMaterialSaveReq](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/enterprise/EnterpriseMaterialSaveReq.java:29)
- [EnterpriseMaterialUploadOpenRspDTO](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/enterprise/EnterpriseMaterialUploadOpenRspDTO.java:37)
- [MiniDamFolderEnterpriseSearchReqVO](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/enterprise/MiniDamFolderEnterpriseSearchReqVO.java:50)
- [EnterpriseTagReq](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/enterprise/EnterpriseTagReq.java:26)
- [EnterpriseTreeTagDTO](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/enterprise/EnterpriseTreeTagDTO.java:13)
- [EnterpriseAutomationSubscribeReq](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/enterprise/EnterpriseAutomationSubscribeReq.java:45)
- [EnterpriseFolderPermissionNotifyCreateReq](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/dto/enterprise/EnterpriseFolderPermissionNotifyCreateReq.java:43)
- [OrgOpenDTO](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam-user/src/main/java/com/tezign/mini/dam/api/user/dto/OrgOpenDTO.java:30)
- [OpenMemberUserReq](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam-user/src/main/java/com/tezign/mini/dam/api/user/dto/OpenMemberUserReq.java:12)
- [OrgOpenMemberDTO](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam-user/src/main/java/com/tezign/mini/dam/api/user/dto/OrgOpenMemberDTO.java:28)

## 不能简单补成“对外支持”的项目

- `groupType`：团队群组接口签名存在该参数，但实现 `queryOrgGroups` 固定调用 `getOrgGroup(orgId, 1)`，没有使用传入的 groupType。当前文档“仅团队成员群组，不含白名单群组”与实际实现一致，不能新增宣称 groupType 可切换群组。
- 上传 `source`：DTO 文件里可看到该字段，但声明被注释，并不是可接收参数。不能把注释当作漏项补进文档。
- `triggerAutomationInbound`：明确 `@Deprecated`；可以写迁移说明，不应推荐新接入使用。
- 修改素材响应：详情对象到 `MiniDamMaterialDTO` 的转换没有像搜索转换那样显式 `setRating(material.getScore())`，且转换发生在标签/元数据更新之前。响应是否体现更新后的评分、标签、元数据需要进一步运行验证；不应靠修改示例掩盖实现问题。
- 图片处理质量 `q`：DTO 注释写默认 80，但未初始化为 80；实现只在 q 非空且合法时追加 quality 参数。默认 80 目前只能视为注释意图，不能从实现确认。
- 能力开关：衍生版本显式检查 `checkCsAssetDerivativeEnabled`；自定义元数据受 customMetadata 控制；搜索公开链接处理受 csDatCapability 控制。这些是有代码证据的功能限制，不等同于“故意从文档删除”。

证据：
- [UserRPCOpenServiceImpl](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/mini-dam-user/src/main/java/com/tezign/intelligence/mini/dam/user/rpc/UserRPCOpenServiceImpl.java:202)
- [MaterialRPCEnterpriseOpenServiceImpl](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/mini-dam-material/src/main/java/com/tezign/intelligence/mini/dam/material/feign/MaterialRPCEnterpriseOpenServiceImpl.java:1520)
- [MaterialRPCEnterpriseOpenServiceImpl](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/mini-dam-material/src/main/java/com/tezign/intelligence/mini/dam/material/feign/MaterialRPCEnterpriseOpenServiceImpl.java:1486)
- [MaterialRPCEnterpriseOpenServiceImpl](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/mini-dam-material/src/main/java/com/tezign/intelligence/mini/dam/material/feign/MaterialRPCEnterpriseOpenServiceImpl.java:1176)

## 后端存在、页面未覆盖的 25 个方法

这些是文档候选项；是否全部对外发布，需要按用途和现网登记判断。

- `/timing-tag` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:185)
- `/consume-point` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:189)
- `/refund-point` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:193)
- `/trigger-video-cut` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:241)
- `/archive-submit` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:251)
- `/pending-inbound-confirm` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:280)
- `/pending-inbound-update-store-path` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:287)
- `/detection-rules` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:314)
- `/detection-task-create` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:323)
- `/detection-task-add-assets` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:332)
- `/migrate-job-create` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:348)
- `/migrate-job-get` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:354)
- `/migrate-job-finish` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:360)
- `/migrate-ensure-folders` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:366)
- `/migrate-file-init` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:372)
- `/migrate-presign-parts` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:378)
- `/migrate-presign-put` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:384)
- `/migrate-file-complete-and-ingest` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:390)
- `/migrate-file-abort` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:397)
- `/migrate-file-get` — [MaterialRPCEnterpriseOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam/src/main/java/com/tezign/mini/dam/api/service/MaterialRPCEnterpriseOpenService.java:403)
- `/user-info` — [UserRPCOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam-user/src/main/java/com/tezign/mini/dam/api/user/service/UserRPCOpenService.java:43)
- `/org-point-info` — [UserRPCOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam-user/src/main/java/com/tezign/mini/dam/api/user/service/UserRPCOpenService.java:103)
- `/org-switches` — [UserRPCOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam-user/src/main/java/com/tezign/mini/dam/api/user/service/UserRPCOpenService.java:110)
- `/org-admins-query` — [UserRPCOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam-user/src/main/java/com/tezign/mini/dam/api/user/service/UserRPCOpenService.java:119)
- `/report-automation-sms-used` — [UserRPCOpenService](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/api/api-mini-dam-user/src/main/java/com/tezign/mini/dam/api/user/service/UserRPCOpenService.java:126)

分类：定时打标 1 个；积分扣除/退还 2 个；视频切条、归档 2 个；待入库 2 个；合规检测 3 个；NAS 迁移 10 个；用户/团队/开关/管理员/短信计量 5 个。

另外发现三个特征服务方法：`save-feature`、`bind-feature-material`、`query-features-by-materials`。旧版个人素材服务还有 `sts-tmp`、`material-save`、`material-list`、`url-analysis`、`wx-upload`。这些不应自动并入当前企业开放 API，更不能把底层服务路径直接作为公网调用地址。

## 如何判断“故意不开放”

公网 /api/muse 经网关进入 open-service，open-service 按方法名查询 open_service 登记，再调用后端。仅有 Controller/Feign 定义并不能证明现网已登记。初始化 SQL 已登记 consume-point、refund-point、timing-tag、org-point-info，因此也不能仅因页面没有这些接口就称它们“内部不开放”。初始化 SQL 仍不是现网数据库快照。

- [OpenEnterpriseCallController](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/mini-dam-open-service/src/main/java/com/tezign/intelligence/mini/dam/open/service/controller/OpenEnterpriseCallController.java:35)
- [OpenStandardCallServiceImpl](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/mini-dam-open-service/src/main/java/com/tezign/intelligence/mini/dam/open/service/service/impl/OpenStandardCallServiceImpl.java:125)
- [OpenServiceBizServiceImpl](/Users/ouyangkang/project2/tezign-intelligence-backend-minidam/mini-dam-open-service/src/main/java/com/tezign/intelligence/mini/dam/open/service/biz/impl/OpenServiceBizServiceImpl.java:24)

要最后确认哪些有意不开放，需要现网 open_service 登记列表、应用授权范围与产品公开清单。目前没有这些证据，故不替产品方推断隐藏意图。

## 建议处理顺序

1. 先修正中英文 rating/score、上传 url 必填性、返回结构等明确错误，并同步复制用 Markdown。
2. 补齐既有接口已实现的普通参数与返回字段。
3. 将未列出的业务接口分为“可公开”“专项对接”“待确认”，再决定是否上官网；积分操作、存储直传、未脱敏信息和计量上报应特别明确授权对象。
4. MCP 工具列表须对照 MCP 服务 tools/list 或服务端 schema；不能因新增了 HTTP 接口就推断已有同名 MCP 工具。本次仓库核对不足以确认 MCP 工具全集。

## 65 个方法的章节覆盖表

这里只标章节是否存在，不代表章节参数已全部正确。内部 HTTP 方法不作为本次差异项。

| 后端服务 | 方法路径 | 页面章节 |
|---|---|---|
| MaterialRPCEnterpriseOpenService | `/upload-assets` | assets |
| MaterialRPCEnterpriseOpenService | `/search-assets` | search |
| MaterialRPCEnterpriseOpenService | `/search-folders` | folders |
| MaterialRPCEnterpriseOpenService | `/create-folder` | folders |
| MaterialRPCEnterpriseOpenService | `/create-folder-tree` | folders |
| MaterialRPCEnterpriseOpenService | `/search-share` | search |
| MaterialRPCEnterpriseOpenService | `/modify-assets` | assets |
| MaterialRPCEnterpriseOpenService | `/move-assets-to-folder` | assets |
| MaterialRPCEnterpriseOpenService | `/assets-by-ids` | assets |
| MaterialRPCEnterpriseOpenService | `/merge-tags` | tags |
| MaterialRPCEnterpriseOpenService | `/folder-path` | folders |
| MaterialRPCEnterpriseOpenService | `/get-sub-folder-ids` | folders |
| MaterialRPCEnterpriseOpenService | `/folder-auto-tags` | folders |
| MaterialRPCEnterpriseOpenService | `/set-assets-tags` | tags |
| MaterialRPCEnterpriseOpenService | `/enterprise-tag-list` | tags |
| MaterialRPCEnterpriseOpenService | `/query-tag-tree` | tags |
| MaterialRPCEnterpriseOpenService | `/get-asset-analysis-result` | analysis |
| MaterialRPCEnterpriseOpenService | `/timing-tag` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/consume-point` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/refund-point` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/processed-public-links` | analysis |
| MaterialRPCEnterpriseOpenService | `/asset-derivative-versions` | analysis |
| MaterialRPCEnterpriseOpenService | `/add-in-app-notify` | team |
| MaterialRPCEnterpriseOpenService | `/check-transferred-materials` | assets |
| MaterialRPCEnterpriseOpenService | `/trigger-video-cut` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/archive-submit` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/material-automation-subscribe` | events |
| MaterialRPCEnterpriseOpenService | `/material-automation-event-types` | events |
| MaterialRPCEnterpriseOpenService | `/pending-inbound-confirm` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/pending-inbound-update-store-path` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/metadata-records-by-ids` | assets |
| MaterialRPCEnterpriseOpenService | `/metadata-fields` | assets |
| MaterialRPCEnterpriseOpenService | `/detection-rules` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/detection-task-create` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/detection-task-add-assets` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/material-access-users-query` | assets |
| MaterialRPCEnterpriseOpenService | `/migrate-job-create` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/migrate-job-get` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/migrate-job-finish` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/migrate-ensure-folders` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/migrate-file-init` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/migrate-presign-parts` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/migrate-presign-put` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/migrate-file-complete-and-ingest` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/migrate-file-abort` | 未覆盖 |
| MaterialRPCEnterpriseOpenService | `/migrate-file-get` | 未覆盖 |
| EnterpriseFolderOpenRpcService | `/folder-subscribe` | events |
| UserRPCOpenService | `/user-info` | 未覆盖 |
| UserRPCOpenService | `/org-info` | team |
| UserRPCOpenService | `/org-member-info` | team |
| UserRPCOpenService | `/org-members-query` | team |
| UserRPCOpenService | `/org-whitelist-query` | team |
| UserRPCOpenService | `/org-departments-query` | team |
| UserRPCOpenService | `/org-groups-query` | team |
| UserRPCOpenService | `/department-members-query` | team |
| UserRPCOpenService | `/group-members-query` | team |
| UserRPCOpenService | `/org-point-info` | 未覆盖 |
| UserRPCOpenService | `/org-switches` | 未覆盖 |
| UserRPCOpenService | `/org-admins-query` | 未覆盖 |
| UserRPCOpenService | `/report-automation-sms-used` | 未覆盖 |
| AppRpcOpenService | `/exchange-api-key` | applications |
| AppRpcOpenService | `/refresh-api-key` | applications |
| AppRpcOpenService | `/revoke-api-key` | applications |
| AppRpcOpenService | `/get-install-status` | applications |
| AppRpcOpenService | `/list-all-install` | applications |
