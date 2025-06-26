# HUANG / POESIA 网站 - Cloudflare 部署指南

## 概述

Cloudflare Pages 是一个优秀的静态网站托管平台，提供：
- 🚀 全球CDN加速
- 🔒 免费SSL证书
- 🛡️ DDoS防护和安全功能
- 📊 详细的分析数据
- 🔄 Git集成自动部署
- 💰 免费额度非常慷慨

## 第一步：准备工作

### 1.1 账号准备
- [ ] Cloudflare 账号（免费注册：https://cloudflare.com）
- [ ] GitHub 账号（用于代码托管）
- [ ] 域名（如果还没有，可以先用Cloudflare提供的免费域名）

### 1.2 项目准备
确保您有完整的项目文件：
```
huang-poesia-website/
├── src/
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## 第二步：上传代码到GitHub

### 2.1 创建GitHub仓库
1. 登录 GitHub
2. 点击 "New repository"
3. 仓库名称：`huang-poesia-website`
4. 设置为 Public（推荐）或 Private
5. 点击 "Create repository"

### 2.2 上传代码
```bash
# 在项目目录中执行
cd huang-poesia-website

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: HUANG / POESIA website"

# 添加远程仓库（替换为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/huang-poesia-website.git

# 推送代码
git push -u origin main
```

## 第三步：配置Cloudflare Pages

### 3.1 创建Pages项目
1. 登录 Cloudflare Dashboard
2. 点击左侧菜单 "Pages"
3. 点击 "Create a project"
4. 选择 "Connect to Git"

### 3.2 连接GitHub
1. 点击 "Connect GitHub"
2. 授权Cloudflare访问您的GitHub
3. 选择 `huang-poesia-website` 仓库
4. 点击 "Begin setup"

### 3.3 配置构建设置
```
项目名称: huang-poesia-website
生产分支: main
构建命令: npm run build
构建输出目录: dist
根目录: /
```

**环境变量（如果需要）：**
```
NODE_VERSION: 18
```

### 3.4 部署项目
1. 点击 "Save and Deploy"
2. 等待构建完成（通常2-5分钟）
3. 获得临时域名：`https://huang-poesia-website.pages.dev`

## 第四步：配置自定义域名

### 4.1 添加域名到Cloudflare
如果域名还未在Cloudflare：
1. 在Cloudflare Dashboard点击 "Add site"
2. 输入您的域名（如：huangpoesia.com）
3. 选择免费计划
4. 按提示修改域名服务器到Cloudflare

### 4.2 配置Pages自定义域名
1. 在Pages项目中点击 "Custom domains"
2. 点击 "Set up a custom domain"
3. 输入您的域名：`huangpoesia.com`
4. 选择激活域名

### 4.3 配置DNS记录
Cloudflare会自动创建CNAME记录：
```
类型: CNAME
名称: huangpoesia.com
目标: huang-poesia-website.pages.dev
代理状态: 已代理（橙色云朵）
```

如果需要www子域名：
```
类型: CNAME  
名称: www
目标: huang-poesia-website.pages.dev
代理状态: 已代理
```

## 第五步：优化Cloudflare设置

### 5.1 SSL/TLS设置
1. 进入 "SSL/TLS" → "概述"
2. 设置加密模式为 "完全（严格）"
3. 启用 "始终使用HTTPS"

### 5.2 速度优化
在 "速度" 菜单中：
- [ ] 启用 "Auto Minify"（CSS、JavaScript、HTML）
- [ ] 启用 "Brotli压缩"
- [ ] 设置 "浏览器缓存TTL" 为 "1个月"

### 5.3 安全设置
在 "安全性" 菜单中：
- [ ] 安全级别设为 "中等"
- [ ] 启用 "Bot Fight Mode"
- [ ] 配置 "页面规则" 用于缓存优化

### 5.4 页面规则配置
创建页面规则优化性能：

**规则1：静态资源缓存**
```
URL模式: huangpoesia.com/assets/*
设置:
- 缓存级别: 缓存所有内容
- 边缘缓存TTL: 1个月
- 浏览器缓存TTL: 1个月
```

**规则2：HTML文件缓存**
```
URL模式: huangpoesia.com/*
设置:
- 缓存级别: 缓存所有内容
- 边缘缓存TTL: 2小时
- 浏览器缓存TTL: 2小时
```

## 第六步：设置自动部署

### 6.1 配置Webhook（可选）
如果需要从其他平台触发部署：
1. 在Pages项目设置中找到 "Build hooks"
2. 创建新的Hook
3. 复制Webhook URL

### 6.2 GitHub Actions自动部署
创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]
  schedule:
    # 每天凌晨2点自动检查更新
    - cron: '0 2 * * *'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Cloudflare Pages
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: huang-poesia-website
        directory: dist
        gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### 6.3 配置GitHub Secrets
在GitHub仓库设置中添加：
- `CLOUDFLARE_API_TOKEN`：Cloudflare API令牌
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare账户ID

## 第七步：配置分析和监控

### 7.1 启用Web Analytics
1. 在Cloudflare Dashboard中点击 "Analytics"
2. 启用 "Web Analytics"
3. 添加您的网站域名
4. 复制跟踪代码到网站

### 7.2 配置告警
1. 进入 "通知"
2. 创建新的通知策略
3. 设置告警条件：
   - 网站宕机
   - 流量异常
   - 安全事件

## 第八步：性能优化

### 8.1 图片优化
启用Cloudflare的图片优化：
1. 进入 "速度" → "优化"
2. 启用 "Polish"（图片压缩）
3. 启用 "Mirage"（图片延迟加载）

### 8.2 缓存策略
配置智能缓存规则：
```javascript
// 在vite.config.js中添加
export default {
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }
}
```

## 第九步：域名邮箱配置（可选）

### 9.1 配置邮箱转发
如果您想要 contact@huangpoesia.com 这样的邮箱：
1. 进入 "电子邮件" → "电子邮件路由"
2. 启用电子邮件路由
3. 添加转发规则：
   ```
   contact@huangpoesia.com → your-personal-email@gmail.com
   hello@huangpoesia.com → your-personal-email@gmail.com
   ```

## 第十步：安全加固

### 10.1 配置安全头
在Pages项目中创建 `_headers` 文件：
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:
```

### 10.2 配置重定向
创建 `_redirects` 文件：
```
# 强制HTTPS
http://huangpoesia.com/* https://huangpoesia.com/:splat 301!
http://www.huangpoesia.com/* https://huangpoesia.com/:splat 301!

# WWW重定向
https://www.huangpoesia.com/* https://huangpoesia.com/:splat 301!

# SPA路由支持
/* /index.html 200
```

## 故障排除

### 常见问题

**1. 构建失败**
```bash
# 检查Node.js版本
node --version

# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

**2. 域名无法访问**
- 检查DNS传播：https://dnschecker.org
- 确认Cloudflare代理状态（橙色云朵）
- 检查SSL证书状态

**3. 样式或脚本加载失败**
- 检查构建输出目录设置
- 确认资源路径正确
- 检查缓存设置

### 联系支持
- Cloudflare社区：https://community.cloudflare.com
- Cloudflare文档：https://developers.cloudflare.com/pages

## 总结

完成以上步骤后，您将拥有：
- ✅ 全球CDN加速的网站
- ✅ 免费SSL证书和安全防护
- ✅ 自动化部署流程
- ✅ 专业的自定义域名
- ✅ 详细的访问分析
- ✅ 高可用性和性能优化

您的网站将以最佳性能为全球用户提供服务！🚀

