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
