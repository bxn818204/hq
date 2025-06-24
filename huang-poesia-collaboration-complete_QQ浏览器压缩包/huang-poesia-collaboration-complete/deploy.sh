#!/bin/bash

# HUANG / POESIA 网站快速部署脚本
# 使用方法：./deploy.sh [platform]
# 支持平台：vercel, netlify, github

set -e

PLATFORM=${1:-"vercel"}
PROJECT_NAME="huang-poesia-website"

echo "🚀 开始部署 HUANG / POESIA 网站到 $PLATFORM"

# 检查依赖
check_dependencies() {
    echo "📋 检查依赖..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装，请先安装 Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm 未安装"
        exit 1
    fi
    
    echo "✅ 依赖检查完成"
}

# 安装项目依赖
install_dependencies() {
    echo "📦 安装项目依赖..."
    
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
    
    echo "✅ 依赖安装完成"
}

# 构建项目
build_project() {
    echo "🔨 构建项目..."
    
    if command -v pnpm &> /dev/null; then
        pnpm run build
    else
        npm run build
    fi
    
    echo "✅ 项目构建完成"
}

# 部署到 Vercel
deploy_vercel() {
    echo "🌐 部署到 Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo "📥 安装 Vercel CLI..."
        npm i -g vercel
    fi
    
    vercel --prod
    
    echo "✅ Vercel 部署完成"
    echo "🔗 请在 Vercel 控制台配置自定义域名"
}

# 部署到 Netlify
deploy_netlify() {
    echo "🌐 部署到 Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        echo "📥 安装 Netlify CLI..."
        npm i -g netlify-cli
    fi
    
    netlify deploy --prod --dir=dist
    
    echo "✅ Netlify 部署完成"
    echo "🔗 请在 Netlify 控制台配置自定义域名"
}

# 准备 GitHub Pages
prepare_github() {
    echo "🐙 准备 GitHub Pages 部署..."
    
    # 创建 gh-pages 分支
    git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
    
    # 复制构建文件
    cp -r dist/* .
    
    # 创建 CNAME 文件（如果有自定义域名）
    read -p "请输入您的自定义域名（可选，直接回车跳过）: " custom_domain
    if [ ! -z "$custom_domain" ]; then
        echo "$custom_domain" > CNAME
    fi
    
    git add .
    git commit -m "Deploy to GitHub Pages"
    git push origin gh-pages
    
    echo "✅ GitHub Pages 准备完成"
    echo "🔗 请在 GitHub 仓库设置中启用 Pages"
}

# 主函数
main() {
    check_dependencies
    install_dependencies
    build_project
    
    case $PLATFORM in
        "vercel")
            deploy_vercel
            ;;
        "netlify")
            deploy_netlify
            ;;
        "github")
            prepare_github
            ;;
        *)
            echo "❌ 不支持的平台: $PLATFORM"
            echo "支持的平台: vercel, netlify, github"
            exit 1
            ;;
    esac
    
    echo ""
    echo "🎉 部署完成！"
    echo "📚 更多配置信息请查看 deployment_guide.md"
}

# 运行主函数
main

