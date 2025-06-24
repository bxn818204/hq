# HUANG / POESIA 个人网站

> 钢铁炼成的黄女士 - 诗意创造者的数字档案馆

## 项目简介

这是一个融合了文艺复兴、古希腊美学和中式传统的个人网站，体现了"酷与古典共存"的设计理念。网站以"HUANG / POESIA"为核心，展现家族传承与个人创作的完美结合。

## 设计特色

- 🏛️ **Art Deco 风格**：优雅的几何线条与金色装饰
- 🎵 **黑胶唱片灵感**：旋转动画与音乐美学
- 📚 **档案库美学**：专业的学术气质与现代数字平台的融合
- 🌏 **东西方融合**：古希腊哲学 + 中式美学 + 文艺复兴元素
- 💎 **华文中宋字体**：优雅的中文排版

## 快速开始

### 1. 解压项目文件
```bash
tar -xzf huang-poesia-website.tar.gz
cd poesia-huang-website
```

### 2. 安装依赖
```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 3. 本地开发
```bash
# 启动开发服务器
pnpm run dev

# 访问 http://localhost:5173
```

### 4. 构建生产版本
```bash
pnpm run build
```

## 快速部署

### 使用部署脚本（推荐）
```bash
# 部署到 Vercel
./deploy.sh vercel

# 部署到 Netlify
./deploy.sh netlify

# 准备 GitHub Pages
./deploy.sh github
```

### 手动部署
详细步骤请查看 `deployment_guide.md`

## 文件结构

```
huang-poesia-website/
├── poesia-huang-website/     # 主项目目录
│   ├── src/
│   │   ├── App.jsx          # 主应用组件
│   │   ├── App.css          # 样式文件
│   │   └── assets/          # 静态资源
│   ├── index.html           # HTML 模板
│   ├── package.json         # 项目依赖
│   └── vite.config.js       # 构建配置
├── deployment_guide.md      # 详细部署指南
├── new_design_concept.md    # 设计理念文档
├── deploy.sh               # 快速部署脚本
└── README.md               # 项目说明
```

## 技术栈

- **框架**：React 18 + Vite
- **样式**：Tailwind CSS + 自定义 CSS
- **字体**：Playfair Display + Inter + 华文中宋
- **动画**：CSS 动画 + 渐变效果
- **图标**：Lucide React

## 内容版块

- 🏠 **首页**：品牌展示与核心理念
- 👤 **关于我**：个人介绍与创作理念
- 🎥 **视频**：深度思考的视频内容
- ✍️ **写作**：文章作品与思考记录
- 📝 **日记**：一句话记录与灵感片段
- 📧 **Newsletter**：订阅功能与内容分发
- 🌐 **社交媒体**：多平台连接与内容策略

## 自定义配置

### 修改个人信息
编辑 `src/App.jsx` 文件中的个人信息部分：
- 姓名和标题
- 个人介绍
- 社交媒体链接
- 联系方式

### 修改样式
编辑 `src/App.css` 文件：
- 颜色主题
- 字体设置
- 动画效果
- 布局样式

### 添加内容
在对应的组件部分添加：
- 视频列表
- 文章内容
- 日记记录
- 作品展示

## 域名配置

### DNS 设置示例
```
类型    名称    值
A       @       your-server-ip
CNAME   www     your-domain.com
```

### SSL 证书
推荐使用 Let's Encrypt 免费证书，或云服务商提供的证书服务。

## 性能优化

- ✅ 代码分割和懒加载
- ✅ 图片优化和压缩
- ✅ CSS 和 JS 压缩
- ✅ Gzip 压缩支持
- ✅ 缓存策略配置

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

本项目仅供个人使用，请勿用于商业用途。

## 技术支持

如有问题，请参考：
1. `deployment_guide.md` - 详细部署指南
2. 各平台官方文档
3. 技术社区和论坛

---

**Made with ❤️ for 钢铁炼成的黄女士**

*La creazione è l'essenza dell'anima* - 创造是灵魂的本质

