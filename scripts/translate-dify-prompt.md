# Dify 工作流 Prompt - 英文转繁体中文翻译

## 快速测试（可直接复制到 Dify）

### 系统提示词 (System Prompt)

```
You are a professional Traditional Chinese (Taiwan) translator for SaaS software UI interfaces.

## Translation Principles

1. **Source Language**: English (en-US)
2. **Target Language**: Traditional Chinese / Taiwan (zh-TW)
3. **Regional Conventions**: 
   - "Login" = "登入" (not "登录")
   - "Settings" = "設定"
   - "Assets" = "素材"
   - Use Traditional Chinese characters (e.g., "軟體" not "软件", "資訊" not "信息")
   - Professional, concise, friendly SaaS UI tone

## Rules

1. Keep JSON structure: translate ONLY the values, never the keys
2. Preserve ALL {{variable}} template variables unchanged
3. Preserve HTML tags, line breaks, URLs, technical terms
4. Maintain consistency: same English term = same Chinese translation throughout
5. Output valid JSON only, no markdown, no explanations
```

### 用户提示词 (User Prompt)

```
Translate the following English JSON into Traditional Chinese (Taiwan, zh-TW).

Input:
{{input_json}}

Requirements:
1. Only translate values, keep keys unchanged
2. Keep all {{xxx}} variables exactly as they are
3. Use Taiwan-style Traditional Chinese vocabulary
4. Return valid JSON only, no markdown code blocks

Output:
```

### 测试输入 (Test Input)

在 Dify 开始节点的 `input_json` 变量中填入：

```json
{
  "hero.title": "Smart Asset Management",
  "hero.button.start": "Start for free",
  "pricing.summary.points": "{{val}} points/month",
  "subscribe.email.placeholder": "Your work email"
}
```

### 期望输出 (Expected Output)

```json
{
  "hero.title": "智慧資產管理",
  "hero.button.start": "免費開始使用",
  "pricing.summary.points": "{{val}} 點數/月",
  "subscribe.email.placeholder": "您的工作電子郵件"
}
```

---

## Dify 工作流完整配置

### 输入 Schema (Input Schema)

```json
{
  "type": "object",
  "properties": {
    "input_json": {
      "type": "string",
      "description": "需要翻译的英文 JSON 字符串"
    },
    "filename": {
      "type": "string",
      "description": "文件名称（可选，用于上下文参考）"
    }
  },
  "required": ["input_json"]
}
```

### 输出 Schema (Output Schema)

```json
{
  "type": "object",
  "properties": {
    "translated_json": {
      "type": "string",
      "description": "翻译后的繁体中文 JSON 字符串"
    }
  },
  "required": ["translated_json"]
}
```

### 节点配置

1. **开始节点**
   - 变量1: `input_json` (String) - 必填
   - 变量2: `filename` (String) - 可选

2. **LLM 节点**
   - 模型: GPT-4 或 Claude 3.5 Sonnet
   - 温度: 0.3
   - 系统提示词: 使用上面的 System Prompt
   - 用户提示词: 使用上面的 User Prompt

3. **结束节点**
   - 输出: `translated_json` - 绑定 LLM 的输出

### API 调用示例

```bash
curl -X POST https://api.dify.ai/v1/workflows/YOUR_WORKFLOW_ID/run \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "inputs": {
      "input_json": "{\"hero.title\": \"Smart Asset Management\", \"hero.button.start\": \"Start for free\"}",
      "filename": "landing-page.json"
    },
    "response_mode": "blocking"
  }'
```