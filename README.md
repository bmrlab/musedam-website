```bash
pnpm payload migrate
pnpm payload run src/seeds/index.mjs
```

## 官网路由规则

nginx 配置了以下规则

```nginx
# 国内
rewrite ^/auth(.*)$ https://musedam.cc/auth$1 permanent; # musedam 海外版 merge 之前现在先跳转到了 login
rewrite ^/(home|detail|share|login|profile|settings)(.*)$ https://musedam.cc/$1$2 permanent;
# 海外
rewrite ^/auth(.*)$ https://musedam.ai/auth$1 permanent;
rewrite ^/(home|detail|share|login|profile|settings)(.*)$ https://musedam.ai/$1$2 permanent;
```

官网的 `auth`、`home`、`detail`、`share`、`login`、`profile`、`settings` 路由会被重定向到应用域名（`musedam.ai`, `musedam.cc`）下对应的路由。

## Help Center 导入/导出与媒体同步

在 Payload Admin Dashboard 中新增了帮助中心迁移工具，包含 3 个按钮：

- `导出帮助中心`：导出 `help-topics` / `help-categories` / `help-documents` 到 JSON 文件
- `导入帮助中心`：上传 JSON（支持 dry-run 预检查）
- `同步帮助中心媒体`：基于 JSON 中的 media manifest 同步缺失媒体（支持 dry-run）

推荐执行顺序：

1. 在源环境点击导出，拿到 JSON 文件
2. 在目标环境先执行导入内容（可先 dry-run）
3. 导入成功后执行媒体同步（可先 dry-run）

媒体同步依赖以下环境变量：

- `HELP_MEDIA_SOURCE_BASE_URL`：源环境站点地址，用于拼接并下载媒体 URL
- `HELP_MEDIA_SOURCE_AUTH_TOKEN`：可选，源环境媒体下载鉴权 token
