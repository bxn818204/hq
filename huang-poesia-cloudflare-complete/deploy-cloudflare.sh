#!/bin/bash

# HUANG / POESIA 网站 - Cloudflare Pages 部署脚本
# 使用方法：./deploy-cloudflare.sh

set -e

PROJECT_NAME="huang-poesia-website"
GITHUB_REPO=""
DOMAIN=""

echo "🌟 HUANG / POESIA 网站 - Cloudflare 部署助手"
echo "================================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印彩色消息
print_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 检查依赖
check_dependencies() {
    print_info "检查系统依赖..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js 18+"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git 未安装，请先安装 Git"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装"
        exit 1
    fi
    
    print_message "系统依赖检查完成"
}

# 收集用户信息
collect_user_info() {
    echo ""
    print_info "请提供以下信息："
    
    # GitHub用户名
    read -p "请输入您的GitHub用户名: " GITHUB_USERNAME
    if [ -z "$GITHUB_USERNAME" ]; then
        print_error "GitHub用户名不能为空"
        exit 1
    fi
    
    GITHUB_REPO="https://github.com/$GITHUB_USERNAME/$PROJECT_NAME.git"
    
    # 域名（可选）
    read -p "请输入您的域名（可选，直接回车跳过）: " DOMAIN
    
    # 确认信息
    echo ""
    print_info "确认信息："
    echo "GitHub仓库: $GITHUB_REPO"
    if [ ! -z "$DOMAIN" ]; then
        echo "自定义域名: $DOMAIN"
    else
        echo "将使用Cloudflare提供的免费域名"
    fi
    
    read -p "信息正确吗？(y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        print_warning "已取消部署"
        exit 0
    fi
}

# 准备项目
prepare_project() {
    print_info "准备项目文件..."
    
    # 检查是否在正确的目录
    if [ ! -f "package.json" ]; then
        print_error "未找到 package.json，请确保在项目根目录运行此脚本"
        exit 1
    fi
    
    # 安装依赖
    print_info "安装项目依赖..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
    
    # 构建项目
    print_info "构建项目..."
    if command -v pnpm &> /dev/null; then
        pnpm run build
    else
        npm run build
    fi
    
    print_message "项目准备完成"
}

# 配置Git仓库
setup_git_repo() {
    print_info "配置Git仓库..."
    
    # 检查是否已经是Git仓库
    if [ ! -d ".git" ]; then
        git init
        print_message "Git仓库已初始化"
    fi
    
    # 添加所有文件
    git add .
    
    # 检查是否有更改需要提交
    if git diff --staged --quiet; then
        print_warning "没有新的更改需要提交"
    else
        git commit -m "Deploy to Cloudflare Pages: $(date)"
        print_message "代码已提交"
    fi
    
    # 添加远程仓库
    if ! git remote get-url origin &> /dev/null; then
        git remote add origin $GITHUB_REPO
        print_message "已添加远程仓库: $GITHUB_REPO"
    else
        print_warning "远程仓库已存在"
    fi
    
    # 推送代码
    print_info "推送代码到GitHub..."
    git push -u origin main 2>/dev/null || git push -u origin master
    print_message "代码已推送到GitHub"
}

# 创建Cloudflare配置文件
create_cloudflare_config() {
    print_info "创建Cloudflare配置文件..."
    
    # 创建_headers文件
    cat > public/_headers << EOF
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:
EOF

    # 创建_redirects文件
    if [ ! -z "$DOMAIN" ]; then
        cat > public/_redirects << EOF
# 强制HTTPS
http://$DOMAIN/* https://$DOMAIN/:splat 301!
http://www.$DOMAIN/* https://$DOMAIN/:splat 301!

# WWW重定向
https://www.$DOMAIN/* https://$DOMAIN/:splat 301!

# SPA路由支持
/* /index.html 200
EOF
    else
        cat > public/_redirects << EOF
# SPA路由支持
/* /index.html 200
EOF
    fi
    
    print_message "Cloudflare配置文件已创建"
}

# 创建GitHub Actions工作流
create_github_actions() {
    print_info "创建GitHub Actions自动部署工作流..."
    
    mkdir -p .github/workflows
    
    cat > .github/workflows/deploy-cloudflare.yml << EOF
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
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
        apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: $PROJECT_NAME
        directory: dist
        gitHubToken: \${{ secrets.GITHUB_TOKEN }}
EOF
    
    print_message "GitHub Actions工作流已创建"
}

# 显示后续步骤
show_next_steps() {
    echo ""
    echo "🎉 项目准备完成！"
    echo "================================================"
    
    print_info "接下来请按以下步骤操作："
    
    echo ""
    echo "1️⃣  在GitHub上创建仓库："
    echo "   - 访问: https://github.com/new"
    echo "   - 仓库名称: $PROJECT_NAME"
    echo "   - 设置为Public"
    echo "   - 不要初始化README、.gitignore或license"
    
    echo ""
    echo "2️⃣  配置Cloudflare Pages："
    echo "   - 访问: https://dash.cloudflare.com"
    echo "   - 点击 'Pages' → 'Create a project'"
    echo "   - 选择 'Connect to Git'"
    echo "   - 连接GitHub并选择 '$PROJECT_NAME' 仓库"
    echo "   - 构建设置："
    echo "     * 构建命令: npm run build"
    echo "     * 构建输出目录: dist"
    echo "     * Node.js版本: 18"
    
    if [ ! -z "$DOMAIN" ]; then
        echo ""
        echo "3️⃣  配置自定义域名："
        echo "   - 在Cloudflare Pages项目中点击 'Custom domains'"
        echo "   - 添加域名: $DOMAIN"
        echo "   - 按提示配置DNS记录"
    fi
    
    echo ""
    echo "4️⃣  配置自动部署（可选）："
    echo "   - 在GitHub仓库设置中添加Secrets："
    echo "     * CLOUDFLARE_API_TOKEN"
    echo "     * CLOUDFLARE_ACCOUNT_ID"
    echo "   - 这样每次推送代码都会自动部署"
    
    echo ""
    echo "📋 重要文件说明："
    echo "   - public/_headers: 安全头配置"
    echo "   - public/_redirects: 重定向规则"
    echo "   - .github/workflows/deploy-cloudflare.yml: 自动部署工作流"
    
    echo ""
    print_message "部署准备完成！按照上述步骤即可完成Cloudflare部署。"
    
    if [ ! -z "$DOMAIN" ]; then
        echo ""
        print_info "部署完成后，您的网站将在以下地址访问："
        echo "   - https://$DOMAIN"
        echo "   - https://$PROJECT_NAME.pages.dev"
    else
        echo ""
        print_info "部署完成后，您的网站将在以下地址访问："
        echo "   - https://$PROJECT_NAME.pages.dev"
    fi
}

# 主函数
main() {
    check_dependencies
    collect_user_info
    prepare_project
    create_cloudflare_config
    create_github_actions
    setup_git_repo
    show_next_steps
}

# 运行主函数
main

