# Muse Open 转发版：审批开放接口调用说明

本文档用于说明如何通过 Muse Open 后端转发地址调用审批开放接口。  
当前联调地址：

- `POST https://muse-open.test.tezign.com/api/muse/approval-api`

> 说明：该地址会由 Muse Open 后端转发到审批中心开放接口。调用方只需要按本文档组织请求体；转发链路中的下游鉴权与内部路由由后端处理。

---

## 1. 调用约定

- 请求方法：`POST`
- `Content-Type`：`application/json`
- 请求体必须为合法 JSON
- 统一使用 `service` 字段区分具体能力

---

## 2. 统一请求体（公共字段）

所有 `service` 都使用以下公共字段：

- `service`（必填，`string`）：接口能力标识
  - 可选值：`subscriptionQuery` / `subscriptionChange` / `listTemplates` / `createApproval` / `taskStatusQuery`

请求体示例：

```json
{
  "service": "listTemplates"
}
```

---

## 3. 统一响应体

所有能力都返回同一结构：

```json
{
  "code": "0",
  "message": "成功",
  "result": {},
  "traceId": "trace_20261012_001"
}
```

字段说明：

- `code`：业务码，`"0"` 表示成功
- `message`：成功时通常为 `"成功"`，失败时为错误原因
- `result`：具体业务结果；失败时为 `null`
- `traceId`：回传链路追踪 ID（若未传，服务端会生成）

常见失败码：

- `code = "400"`：参数错误（例如 `invalid_payload:*`）
- `code = "401"`：鉴权失败（由转发链路返回）
- `code = "403"`：权限不足
- `code = "404"`：资源不存在（如 `team_not_found`、`template_not_found`、`task_not_found`、`asset_not_found`）
- `code = "500"`：服务内部错误

---

## 4. 各 service 入参/出参

## 4.1 `subscriptionQuery`（查询是否订阅）

### 入参

- 公共字段：`service`

请求示例：

```json
{
  "service": "subscriptionQuery"
}
```

### 出参（`result`）

- `subscribed`（`boolean`）
- `callbackUrl`（`string | null`）
- `updatedAt`（`string | null`，ISO 时间）

成功响应示例：

```json
{
  "code": "0",
  "message": "成功",
  "result": {
    "subscribed": true,
    "callbackUrl": "https://example.com/webhook/approval",
    "updatedAt": "2026-10-12T07:30:00.000Z"
  },
  "traceId": "trace_sub_query_001"
}
```

---

## 4.2 `subscriptionChange`（订阅/取消订阅）

### 入参

- 公共字段：`service`
- `operation`（选填，`string`）：`ADD` 或 `DELETE`，默认 `ADD`
- `callbackUrl`（条件必填，`string`）
  - 当 `operation = ADD` 时必填
  - 必须是 `http/https` 地址

订阅示例（ADD）：

```json
{
  "service": "subscriptionChange",
  "operation": "ADD",
  "callbackUrl": "https://example.com/webhook/approval"
}
```

取消示例（DELETE）：

```json
{
  "service": "subscriptionChange",
  "operation": "DELETE"
}
```

### 出参（`result`）

- `boolean`
  - `true`：当前为已订阅状态
  - `false`：当前为取消订阅状态

响应示例：

```json
{
  "code": "0",
  "message": "成功",
  "result": true,
  "traceId": "trace_sub_add_001"
}
```

---

## 4.3 `listTemplates`（获取审批模板）

### 入参

- 公共字段：`service`

请求示例：

```json
{
  "service": "listTemplates"
}
```

### 出参（`result`）

`result` 为数组，每项模板对象包含：

- `id`（`string`）
- `name`（`string`）
- `description`（`string`）
- `enabled`（`boolean`）
- `usageCount`（`number`）
- `autoImportEnabled`（`boolean`）
- `targetFolder`（`{ id: string; name: string } | null`）
- `workflow`（节点数组）
  - `id`、`order`、`name`
  - `signMode`（`or | and`）
  - `timeoutHours`
  - `approvers`（审批人）
  - `ccUsers`（抄送人）
  - `timeoutTransferTo`（超时转交人，可为空）

响应示例（节选）：

```json
{
  "code": "0",
  "message": "成功",
  "result": [
    {
      "id": "101",
      "name": "标准素材审批",
      "description": "用于自动化入库前审批",
      "enabled": true,
      "usageCount": 32,
      "autoImportEnabled": true,
      "targetFolder": {
        "id": "folder_001",
        "name": "已审批素材"
      },
      "workflow": [
        {
          "id": "node_01",
          "order": 0,
          "name": "审批节点1",
          "signMode": "or",
          "timeoutHours": 24,
          "approvers": [
            {
              "id": "10086",
              "name": "张三"
            }
          ],
          "ccUsers": [],
          "timeoutTransferTo": null
        }
      ]
    }
  ],
  "traceId": "trace_tpl_001"
}
```

---

## 4.4 `createApproval`（创建审批任务）

### 入参

- 公共字段：`service`
- `templateId`（必填，`string`）
- `createdBy`（必填，`string`）：发起人用户 ID
- `assets`（必填，`array`，至少 1 条）
  - `name`（必填，`string`，建议传原始文件名）
  - `size`（选填，`number`）
  - `mimeType`（选填，`string`）
  - `extension`（选填，`string`）
  - `url`（必填，`string`，必须是公网可访问 `http/https`）
- `sourceContext`（选填，`object`）
- `reason`（选填，`string`）

请求示例：

```json
{
  "service": "createApproval",
  "templateId": "101",
  "createdBy": "10086",
  "assets": [
    {
      "name": "demo.mp4",
      "size": 1048576,
      "mimeType": "video/mp4",
      "extension": "mp4",
      "url": "https://cdn.example.com/m/asset_1.mp4"
    }
  ],
  "sourceContext": {
    "bizType": "campaign",
    "bizId": "cmp_9527"
  },
  "reason": "素材上线前审批"
}
```

### 出参（`result`）

- `taskId`（`string`）：审批任务 ID

响应示例：

```json
{
  "code": "0",
  "message": "成功",
  "result": {
    "taskId": "9527"
  },
  "traceId": "trace_create_001"
}
```

### `createApproval` 调用限制（建议重点关注）

- `assets` 不能为空
- `assets[].url` 不能为空，且同一请求内不允许重复
- `assets[].url` 必须是公网可访问地址，不能是 `localhost`、内网地址或私网 IP
- 文件下载超时或超出大小限制会返回 `invalid_payload:*`
- 下游找不到模板/组织/任务素材时会返回 `404` 类错误（`template_not_found`、`team_not_found`、`asset_not_found`）

---

## 4.5 `taskStatusQuery`（查询任务状态）

### 入参

- 公共字段：`service`
- `taskId`（必填，`string`，需为正整数）

请求示例：

```json
{
  "service": "taskStatusQuery",
  "taskId": "9527"
}
```

### 出参（`result`）

- `taskId`（`string`）
- `status`（`PENDING | PROCESSING | APPROVED | REJECTED | CANCELED`）
- `statusLabel`（`string`）
- `progressPercent`（`number`）
- `currentNodeName`（`string | null`）
- `currentNodeSignMode`（`or | and | null`）
- `currentNodeProgress`（当前节点通过/拒绝/待审统计）
- `currentNodeApprovers`（当前节点审批人状态列表）
- `operator`（`string | null`）
- `updatedAt`（`string`，ISO 时间）

响应示例：

```json
{
  "code": "0",
  "message": "成功",
  "result": {
    "taskId": "9527",
    "status": "PROCESSING",
    "statusLabel": "审批中",
    "progressPercent": 50,
    "currentNodeName": "审批节点2",
    "currentNodeSignMode": "and",
    "currentNodeProgress": {
      "total": 2,
      "approved": 1,
      "rejected": 0,
      "skipped": 0,
      "pending": 1
    },
    "currentNodeApprovers": [
      {
        "name": "张三",
        "status": "approved"
      },
      {
        "name": "李四",
        "status": "pending"
      }
    ],
    "operator": "张三",
    "updatedAt": "2026-10-12T07:45:00.000Z"
  },
  "traceId": "trace_status_001"
}
```

---

## 5. 订阅回调 payload 说明

当调用 `subscriptionChange` 且 `operation = ADD` 成功后，审批状态变化会回调到你传入的 `callbackUrl`。

### 5.1 回调请求基础约定

- 请求方法：`POST`
- `Content-Type`：`application/json`
- 回调体结构：

```json
{
  "eventId": "evt_xxx",
  "eventTime": "1760258885000",
  "payload": {
    "eventName": "TASK_APPROVED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "APPROVED"
  }
}
```

字段说明：

- `eventId`：事件唯一 ID（接收方建议按此做幂等）
- `eventTime`：毫秒时间戳字符串
- `payload`：业务数据体

### 5.2 payload 公共字段

每个回调事件的 `payload` 至少包含：

- `eventName`：事件名
- `orgId`：组织 ID（由系统填充）
- `taskId`：审批任务 ID
- `taskStatus`：任务状态（`PROCESSING` / `APPROVED` / `TIMEOUT`）

### 5.3 事件全集（触发条件）

- `NODE_STARTED`：节点开始处理时触发（创建任务首节点、节点流转到下一节点、流转到重提节点都会触发）
- `APPROVER_SUBMITTED`：审批人在节点提交审批意见时触发（同一节点可多次触发，不同审批人各触发一次）
- `NODE_COMPLETED`：某节点办结时触发（通过/拒绝）
- `NODE_TRANSFERRED`：节点办结后流转到下一处理节点时触发（正常流转、重提流转、超时转交流转）
- `SUBMITTER_RESUBMITTED`：发起人在“待重新提交”节点提交新素材时触发
- `TASK_APPROVED`：任务终态通过时触发
- `NODE_TIMEOUT`：节点超时时触发（超时转交或超时待重新分配）

### 5.4 字段定义（完整）

#### 5.4.1 `payload.node`（节点对象）

- `nodeId`（`string`）：节点 ID（必有）
- `nodeOrder`（`number`）：节点顺序（部分事件存在）
- `nodeRole`（`string`）：节点角色（`normal` / `resubmit_submitter` / `resubmit_approver`，部分事件存在）
- `nodeStatus`（`string`）：节点状态
  - 常见值：`pending` / `processing` / `approved` / `rejected` / `timeout_transferred` / `re_assigned`
- `signMode`（`string`）：签审模式（`and` / `or`，按场景出现）
- `approverCount`（`number`）：审批人数（按场景出现）
- `approvers`（`array`）：节点办结时审批人结果（`NODE_COMPLETED`）
  - 子项：`id`、`name`、`status`
- `startedAt`（`string`）：节点开始时间（ISO）
- `completedAt`（`string`）：节点完成时间（ISO）
- `timeoutHours`（`number`）：节点超时阈值小时数（超时事件出现）

#### 5.4.2 `payload.approver`（审批人提交对象，`APPROVER_SUBMITTED`）

- `id`（`string`）：审批人用户 ID
- `name`（`string`）：审批人名称
- `decision`（`approved | rejected`）：审批决定
- `comment`（`string`）：审批意见
- `submittedAt`（`string`）：提交时间（ISO）

#### 5.4.3 `payload.submitter`（提交人对象，`SUBMITTER_RESUBMITTED`）

- `id`（`string`）：提交人用户 ID
- `name`（`string`）：提交人名称
- `comment`（`string`）：重提备注
- `submittedAt`（`string`）：提交时间（ISO）

#### 5.4.4 `payload.timeout`（超时对象）

- `transferTo`（`object | null`）：超时转交目标
  - 有转交人时：`{ "id": "...", "name": "..." }`
  - 无转交人时：`null`

#### 5.4.5 `payload.latestAssets`（重提素材快照，`SUBMITTER_RESUBMITTED`）

- `assetId`（`string`）
- `filePathId`（`string`）
- `version`（`number`）
- `oldStorePath`（`string`）：旧版本存储路径
- `newStorePath`（`string`）：新版本存储路径
- `updatedAt`（`string`）：更新时间（ISO）

#### 5.4.6 `payload.transferReason`（`NODE_TRANSFERRED`）

- `NEXT_NODE`：正常流转到下一审批节点
- `RESUBMIT_SUBMITTER`：流转到待重新提交节点
- `RESUBMIT_APPROVER`：重提后流转到重审节点
- `TIMEOUT_TRANSFER`：超时后转交

### 5.5 回调示例（全事件）

`TASK_APPROVED` 示例：

```json
{
  "eventId": "evt_2a93f5f5f4d64907a2f3b73cb8f0f201",
  "eventTime": "1760258885000",
  "payload": {
    "eventName": "TASK_APPROVED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "APPROVED",
    "operator": {
      "id": "10086",
      "name": "张三"
    },
    "finishedAt": "2026-10-12T08:08:05.000Z"
  }
}
```

`NODE_STARTED` 示例：

```json
{
  "eventId": "evt_d3a39140643a4d73afedf0a47c0a601d",
  "eventTime": "1760258700000",
  "payload": {
    "eventName": "NODE_STARTED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "PROCESSING",
    "node": {
      "nodeId": "12001",
      "nodeOrder": 1,
      "nodeRole": "normal",
      "nodeStatus": "processing",
      "signMode": "and",
      "approverCount": 2,
      "startedAt": "2026-10-12T08:05:00.000Z"
    }
  }
}
```

`APPROVER_SUBMITTED` 示例：

```json
{
  "eventId": "evt_8bc9f92f83564f10adf8270b598f95d2",
  "eventTime": "1760258820000",
  "payload": {
    "eventName": "APPROVER_SUBMITTED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "PROCESSING",
    "node": {
      "nodeId": "12001",
      "nodeOrder": 1,
      "nodeStatus": "processing",
      "signMode": "and"
    },
    "approver": {
      "id": "10086",
      "name": "张三",
      "decision": "approved",
      "comment": "同意",
      "submittedAt": "2026-10-12T08:07:00.000Z"
    },
    "approverCount": 2
  }
}
```

`NODE_COMPLETED` 示例：

```json
{
  "eventId": "evt_652d4d8c09d24477af9fdb21624fd070",
  "eventTime": "1760258855000",
  "payload": {
    "eventName": "NODE_COMPLETED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "PROCESSING",
    "node": {
      "nodeId": "12001",
      "nodeOrder": 1,
      "nodeStatus": "approved",
      "signMode": "and",
      "approvers": [
        {
          "id": "10086",
          "name": "张三",
          "status": "approved"
        },
        {
          "id": "10087",
          "name": "李四",
          "status": "approved"
        }
      ],
      "completedAt": "2026-10-12T08:07:35.000Z"
    }
  }
}
```

`NODE_TRANSFERRED` 示例（正常流转）：

```json
{
  "eventId": "evt_21881077723e4a17aa4e2e58ee78ce79",
  "eventTime": "1760258856000",
  "payload": {
    "eventName": "NODE_TRANSFERRED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "PROCESSING",
    "transferReason": "NEXT_NODE",
    "fromNode": {
      "nodeId": "12001",
      "nodeOrder": 1,
      "nodeStatus": "approved"
    },
    "node": {
      "nodeId": "12002",
      "nodeOrder": 2,
      "nodeRole": "normal",
      "nodeStatus": "pending"
    }
  }
}
```

`NODE_TRANSFERRED` 示例（拒绝后流转到待重提）：

```json
{
  "eventId": "evt_e612f8b5e1de4960bb712d3df18e2617",
  "eventTime": "1760258900000",
  "payload": {
    "eventName": "NODE_TRANSFERRED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "PROCESSING",
    "transferReason": "RESUBMIT_SUBMITTER",
    "fromNode": {
      "nodeId": "12001",
      "nodeOrder": 1,
      "nodeStatus": "rejected"
    },
    "node": {
      "nodeId": "13001",
      "nodeOrder": 2,
      "nodeRole": "resubmit_submitter",
      "nodeStatus": "pending"
    }
  }
}
```

`NODE_TRANSFERRED` 示例（重提后流转到重审）：

```json
{
  "eventId": "evt_f0c43dd5ca5d4fca9e4adbe536fbb8f5",
  "eventTime": "1760259005000",
  "payload": {
    "eventName": "NODE_TRANSFERRED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "PROCESSING",
    "transferReason": "RESUBMIT_APPROVER",
    "fromNode": {
      "nodeId": "13001",
      "nodeOrder": 2,
      "nodeStatus": "approved"
    },
    "node": {
      "nodeId": "13002",
      "nodeOrder": 3,
      "nodeRole": "resubmit_approver",
      "nodeStatus": "pending"
    }
  }
}
```

`NODE_TIMEOUT` 示例（超时转交）：

```json
{
  "eventId": "evt_b0d67fb6f3de42e79a60b8f9df6ad20d",
  "eventTime": "1760260000000",
  "payload": {
    "eventName": "NODE_TIMEOUT",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "TIMEOUT",
    "node": {
      "nodeId": "12002",
      "nodeStatus": "timeout_transferred",
      "timeoutHours": 24
    },
    "timeout": {
      "transferTo": {
        "id": "10100",
        "name": "王五"
      }
    }
  }
}
```

`NODE_TIMEOUT` 示例（超时未转交）：

```json
{
  "eventId": "evt_2e4372871f0c4a7eb95a9d7c638de8a0",
  "eventTime": "1760260100000",
  "payload": {
    "eventName": "NODE_TIMEOUT",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "TIMEOUT",
    "node": {
      "nodeId": "12002",
      "nodeStatus": "re_assigned",
      "timeoutHours": 24
    },
    "timeout": {
      "transferTo": null
    }
  }
}
```

`SUBMITTER_RESUBMITTED` 示例：

```json
{
  "eventId": "evt_5d017db5b458443697f6c10d5f6370df",
  "eventTime": "1760259000000",
  "payload": {
    "eventName": "SUBMITTER_RESUBMITTED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "PROCESSING",
    "node": {
      "nodeId": "12002",
      "nodeOrder": 3,
      "nodeStatus": "approved",
      "signMode": "and"
    },
    "submitter": {
      "id": "10010",
      "name": "李四",
      "comment": "已更新素材，重新提交",
      "submittedAt": "2026-10-12T08:10:00.000Z"
    },
    "latestAssets": [
      {
        "assetId": "asset_1",
        "filePathId": "30001",
        "version": 3,
        "oldStorePath": "assets/old/asset_1_v2.mp4",
        "newStorePath": "assets/new/asset_1_v3.mp4",
        "updatedAt": "2026-10-12T08:10:00.000Z"
      }
    ],
    "latestAssetCount": 1
  }
}
```

`NODE_TRANSFERRED` 示例（超时转交后）：

```json
{
  "eventId": "evt_15f4348dd4f34a4b9d51ec93313f4dff",
  "eventTime": "1760260001000",
  "payload": {
    "eventName": "NODE_TRANSFERRED",
    "orgId": "233",
    "taskId": "9527",
    "taskStatus": "PROCESSING",
    "transferReason": "TIMEOUT_TRANSFER",
    "node": {
      "nodeId": "12002",
      "nodeStatus": "timeout_transferred"
    },
    "timeout": {
      "transferTo": {
        "id": "10100",
        "name": "王五"
      }
    }
  }
}
```

### 5.6 事件时序（关键流程）

说明：回调为“至少一次投递”，消费方应按 `eventId` 做幂等去重，不要假设不会重复投递。

#### 5.6.1 正常通过（多节点）

1. `NODE_STARTED`（首节点开始）
2. `APPROVER_SUBMITTED`（每位审批人提交时触发，可能多次）
3. `NODE_COMPLETED`（当前节点完成）
4. 若有下一节点：`NODE_TRANSFERRED` -> `NODE_STARTED`
5. 重复 2~4，直到最后一个节点完成
6. `TASK_APPROVED`（任务终态通过）

#### 5.6.2 拒绝后重提

1. `APPROVER_SUBMITTED`（`decision = rejected`）
2. `NODE_COMPLETED`（`nodeStatus = rejected`）
3. `NODE_TRANSFERRED`（`transferReason = RESUBMIT_SUBMITTER`）
4. `NODE_STARTED`（`nodeRole = resubmit_submitter`）
5. `SUBMITTER_RESUBMITTED`（提交人重提）
6. `NODE_COMPLETED`（重提节点完成）
7. `NODE_TRANSFERRED`（`transferReason = RESUBMIT_APPROVER`）
8. `NODE_STARTED`（重审节点开始）
9. 后续再次进入正常审批链路（`APPROVER_SUBMITTED` ...）

#### 5.6.3 超时转交 / 超时未转交

1. 节点超时触发 `NODE_TIMEOUT`（`taskStatus = TIMEOUT`）
2. 若配置了超时转交人：紧接着触发 `NODE_TRANSFERRED`（`transferReason = TIMEOUT_TRANSFER`），任务回到 `PROCESSING`
3. 若无可转交人：仅有 `NODE_TIMEOUT`（常见 `nodeStatus = re_assigned`），等待人工处理后再推进

---

## 6. curl 示例（Muse Open 转发地址）

以下示例统一使用测试地址：

- `https://muse-open.test.tezign.com/api/muse/approval-api`

### 6.1 查询模板

```bash
curl --location --request POST 'https://muse-open.test.tezign.com/api/muse/approval-api' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "service": "listTemplates"
  }'
```

### 6.2 创建审批任务

```bash
curl --location --request POST 'https://muse-open.test.tezign.com/api/muse/approval-api' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "service": "createApproval",
    "templateId": "101",
    "createdBy": "10086",
    "assets": [
      {
        "name": "demo.mp4",
        "url": "https://cdn.example.com/m/asset_1.mp4"
      }
    ]
  }'
```

### 6.3 查询任务状态

```bash
curl --location --request POST 'https://muse-open.test.tezign.com/api/muse/approval-api' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "service": "taskStatusQuery",
    "taskId": "9527"
  }'
```

### 6.4 查询订阅

```bash
curl --location --request POST 'https://muse-open.test.tezign.com/api/muse/approval-api' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "service": "subscriptionQuery"
  }'
```

### 6.5 订阅回调

```bash
curl --location --request POST 'https://muse-open.test.tezign.com/api/muse/approval-api' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "service": "subscriptionChange",
    "operation": "ADD",
    "callbackUrl": "https://example.com/webhook/approval"
  }'
```

