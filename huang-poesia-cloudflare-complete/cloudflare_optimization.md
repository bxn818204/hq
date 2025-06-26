# Cloudflare 优化配置指南

## 页面规则配置

### 规则1：静态资源缓存优化
```
URL模式: your-domain.com/assets/*
设置:
- 缓存级别: 缓存所有内容
- 边缘缓存TTL: 1年
- 浏览器缓存TTL: 1年
- 安全级别: 基本上关闭
```

### 规则2：HTML文件缓存
```
URL模式: your-domain.com/*
设置:
- 缓存级别: 缓存所有内容
- 边缘缓存TTL: 2小时
- 浏览器缓存TTL: 2小时
```

### 规则3：API路由（如果有）
```
URL模式: your-domain.com/api/*
设置:
- 缓存级别: 绕过
- 安全级别: 高
```

## DNS 配置

### 主域名
```
类型: CNAME
名称: @
目标: huang-poesia-website.pages.dev
代理状态: 已代理（橙色云朵）
TTL: 自动
```

### WWW子域名
```
类型: CNAME
名称: www
目标: huang-poesia-website.pages.dev
代理状态: 已代理（橙色云朵）
TTL: 自动
```

### 邮箱记录（可选）
```
类型: MX
名称: @
邮件服务器: route1.mx.cloudflare.net
优先级: 10
代理状态: 仅DNS（灰色云朵）
```

## SSL/TLS 配置

### 加密设置
- 加密模式: 完全（严格）
- 最低TLS版本: 1.2
- 机会性加密: 开启
- TLS 1.3: 开启
- 自动HTTPS重写: 开启
- 证书透明度监控: 开启

### HSTS设置
```
启用HSTS: 是
最大年龄: 6个月
包含子域名: 是
预加载: 是
```

## 速度优化配置

### Auto Minify
```
JavaScript: 开启
CSS: 开启
HTML: 开启
```

### 其他优化
- Brotli压缩: 开启
- Early Hints: 开启
- HTTP/2: 开启
- HTTP/3 (QUIC): 开启
- 0-RTT连接恢复: 开启

### 图片优化
- Polish: 有损压缩
- WebP转换: 开启
- Mirage: 开启（移动端图片优化）

## 安全配置

### 防火墙规则
```
规则1: 阻止恶意机器人
表达式: (cf.bot_management.score lt 30)
操作: 阻止

规则2: 地理位置限制（可选）
表达式: (ip.geoip.country ne "CN" and ip.geoip.country ne "US" and ip.geoip.country ne "GB")
操作: 质询

规则3: 速率限制
表达式: (http.request.uri.path eq "/contact")
操作: 速率限制（10请求/分钟）
```

### Bot管理
- Bot Fight Mode: 开启
- Super Bot Fight Mode: 开启（付费功能）
- 验证码质询: 开启

### DDoS防护
- HTTP DDoS攻击防护: 开启
- 网络层DDoS攻击防护: 开启
- 敏感度: 高

## 分析和监控

### Web Analytics
```
启用Web Analytics: 是
跟踪代码位置: </head>标签前
隐私友好: 是
```

### 告警配置
```
告警类型: 
- 流量异常
- 错误率增加
- 源服务器错误
- SSL证书过期

通知方式:
- 邮件
- Webhook（可选）
```

## 性能监控

### Real User Monitoring (RUM)
```
启用RUM: 是
采样率: 100%
监控指标:
- 页面加载时间
- 首次内容绘制(FCP)
- 最大内容绘制(LCP)
- 累积布局偏移(CLS)
```

### 自定义指标
```javascript
// 在网站中添加性能监控代码
window.addEventListener('load', function() {
  // 发送自定义性能数据到Cloudflare Analytics
  if (navigator.sendBeacon) {
    const perfData = {
      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
      domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
    };
    
    navigator.sendBeacon('/analytics', JSON.stringify(perfData));
  }
});
```

## 缓存策略

### 浏览器缓存
```javascript
// 在vite.config.js中配置
export default {
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name].[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name].[hash][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        },
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js'
      }
    }
  }
}
```

### 边缘缓存
```
静态资源 (CSS, JS, 图片): 1年
HTML文件: 2小时
API响应: 5分钟
字体文件: 1年
```

## Workers 脚本（高级）

### 自定义响应头
```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  
  // 添加自定义安全头
  const newHeaders = new Headers(response.headers)
  newHeaders.set('X-Powered-By', 'HUANG / POESIA')
  newHeaders.set('X-Content-Type-Options', 'nosniff')
  newHeaders.set('X-Frame-Options', 'DENY')
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
```

### A/B测试
```javascript
// 简单的A/B测试实现
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // 50%的用户看到版本B
  if (Math.random() < 0.5) {
    url.searchParams.set('version', 'b')
  }
  
  return fetch(url.toString(), request)
}
```

## 备份和恢复

### 配置备份
定期导出Cloudflare配置：
```bash
# 使用Cloudflare API导出配置
curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone_id}/settings" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" > cloudflare-config-backup.json
```

### 快速恢复
```bash
# 恢复配置的脚本
#!/bin/bash
ZONE_ID="your-zone-id"
API_TOKEN="your-api-token"

# 恢复DNS记录
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  --data @dns-backup.json
```

## 成本优化

### 免费额度监控
```
Pages构建: 500次/月
Pages请求: 100,000次/月
带宽: 无限制
Workers请求: 100,000次/天
```

### 付费功能建议
```
优先级1: Argo Smart Routing ($5/月)
优先级2: Load Balancing ($5/月)
优先级3: Rate Limiting ($5/月)
优先级4: Bot Management ($10/月)
```

## 故障排除

### 常见问题
1. **522错误**: 检查源服务器连接
2. **525错误**: SSL握手失败
3. **1000错误**: DNS解析问题
4. **缓存问题**: 清除缓存或调整缓存规则

### 调试工具
- Cloudflare Trace: your-domain.com/cdn-cgi/trace
- 网络诊断: dig your-domain.com
- SSL检查: https://www.ssllabs.com/ssltest/

这个配置将为您的网站提供最佳的性能、安全性和可靠性！

