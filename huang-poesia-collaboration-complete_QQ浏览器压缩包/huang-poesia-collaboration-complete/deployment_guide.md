# HUANG / POESIA 网站部署指南

## 概述
本指南将帮助您将"钢铁炼成的黄女士"个人网站部署到您自己的域名和云服务上。

## 项目结构
```
poesia-huang-website/
├── src/
│   ├── App.jsx          # 主应用组件
│   ├── App.css          # 样式文件
│   └── assets/          # 静态资源
├── index.html           # HTML模板
├── package.json         # 项目依赖
├── vite.config.js       # 构建配置
└── dist/               # 构建输出目录
```

## 部署选项

### 选项1：Vercel（推荐）
**优势**：免费、简单、自动部署、支持自定义域名

**步骤**：
1. 注册 [Vercel](https://vercel.com) 账号
2. 安装 Vercel CLI：`npm i -g vercel`
3. 在项目目录运行：`vercel`
4. 按提示配置项目
5. 在 Vercel 控制台添加自定义域名

### 选项2：Netlify
**优势**：免费、易用、支持表单处理

**步骤**：
1. 注册 [Netlify](https://netlify.com) 账号
2. 拖拽 `dist` 文件夹到 Netlify 部署页面
3. 或连接 GitHub 仓库自动部署
4. 在设置中添加自定义域名

### 选项3：GitHub Pages
**优势**：免费、与 GitHub 集成

**步骤**：
1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 `gh-pages` 分支或 `docs` 文件夹
4. 配置自定义域名（需要 CNAME 文件）

### 选项4：阿里云/腾讯云
**优势**：国内访问速度快、完全控制

**步骤**：
1. 购买云服务器（ECS/CVM）
2. 安装 Nginx
3. 上传 `dist` 文件夹内容到服务器
4. 配置 Nginx 虚拟主机
5. 配置域名解析

## 本地开发环境设置

### 前置要求
- Node.js 18+ 
- npm 或 pnpm

### 安装步骤
```bash
# 1. 进入项目目录
cd poesia-huang-website

# 2. 安装依赖
pnpm install
# 或
npm install

# 3. 启动开发服务器
pnpm run dev
# 或
npm run dev

# 4. 构建生产版本
pnpm run build
# 或
npm run build
```

## 域名配置

### DNS 设置
1. **A 记录**：将域名指向服务器 IP
2. **CNAME 记录**：将 www 子域名指向主域名
3. **SSL 证书**：启用 HTTPS（推荐使用 Let's Encrypt）

### 示例配置
```
类型    名称    值
A       @       your-server-ip
CNAME   www     your-domain.com
```

## Nginx 配置示例

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # 网站根目录
    root /var/www/your-domain.com;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

## 性能优化建议

### 1. 图片优化
- 使用 WebP 格式
- 启用图片懒加载
- 压缩图片文件

### 2. 代码优化
- 启用 Gzip 压缩
- 使用 CDN 加速
- 代码分割和懒加载

### 3. 缓存策略
- 静态资源长期缓存
- HTML 文件短期缓存
- 使用 Service Worker

## 监控和分析

### 推荐工具
- **Google Analytics**：访问统计
- **Google Search Console**：SEO 监控
- **Uptime Robot**：网站可用性监控
- **PageSpeed Insights**：性能分析

## 备份策略

### 代码备份
- GitHub 仓库备份
- 定期下载代码副本

### 数据备份
- 定期备份服务器数据
- 使用云存储备份

## 安全建议

### 基础安全
- 定期更新依赖包
- 使用强密码
- 启用双因素认证

### 服务器安全
- 配置防火墙
- 定期安全更新
- 监控异常访问

## 成本估算

### 免费方案
- Vercel/Netlify：免费额度通常足够个人网站
- GitHub Pages：完全免费

### 付费方案
- 云服务器：¥100-500/月
- 域名：¥50-100/年
- SSL 证书：免费（Let's Encrypt）或 ¥100-500/年

## 技术支持

如果在部署过程中遇到问题，可以：
1. 查看各平台的官方文档
2. 搜索相关技术社区
3. 联系云服务商技术支持

## 下一步

1. 选择适合的部署平台
2. 准备域名和必要的账号
3. 按照对应平台的步骤进行部署
4. 配置域名解析
5. 测试网站功能
6. 设置监控和备份

祝您部署顺利！🚀

