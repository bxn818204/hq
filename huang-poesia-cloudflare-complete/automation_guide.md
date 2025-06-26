# HUANG / POESIA 网站自动化维护指南

## 概述

本指南提供完整的自动化维护方案，让您的个人网站能够自动运行、更新、备份和监控，最大程度减少手动维护工作。

## 1. 内容自动化更新

### 1.1 GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: Auto Deploy

on:
  push:
    branches: [ main ]
  schedule:
    # 每天凌晨 2 点检查更新
    - cron: '0 2 * * *'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./
```

### 1.2 内容管理系统集成

创建 `scripts/content-sync.js`：

```javascript
// 自动同步小红书、微信公众号等平台内容
const fs = require('fs');
const path = require('path');

class ContentSync {
  constructor() {
    this.contentDir = './src/content';
    this.platforms = {
      xiaohongshu: process.env.XHS_API_KEY,
      wechat: process.env.WECHAT_API_KEY,
      youtube: process.env.YOUTUBE_API_KEY
    };
  }

  async syncFromPlatforms() {
    console.log('🔄 开始同步平台内容...');
    
    // 同步小红书内容
    await this.syncXiaohongshu();
    
    // 同步微信公众号文章
    await this.syncWechat();
    
    // 同步 YouTube 视频
    await this.syncYoutube();
    
    // 更新网站内容
    await this.updateWebsite();
    
    console.log('✅ 内容同步完成');
  }

  async syncXiaohongshu() {
    // 获取最新的小红书动态
    // 转换为网站的"一句话记录"格式
  }

  async syncWechat() {
    // 获取最新的公众号文章
    // 转换为网站的"写作作品"格式
  }

  async syncYoutube() {
    // 获取最新的 YouTube 视频
    // 转换为网站的"视频"格式
  }

  async updateWebsite() {
    // 更新 App.jsx 中的内容数据
    // 触发重新构建和部署
  }
}

// 定时执行
if (require.main === module) {
  const sync = new ContentSync();
  sync.syncFromPlatforms().catch(console.error);
}

module.exports = ContentSync;
```

### 1.3 RSS 订阅自动更新

创建 `scripts/rss-generator.js`：

```javascript
const RSS = require('rss');
const fs = require('fs');

function generateRSS() {
  const feed = new RSS({
    title: 'HUANG / POESIA - 钢铁炼成的黄女士',
    description: '诗意创造者的思想档案',
    feed_url: 'https://your-domain.com/rss.xml',
    site_url: 'https://your-domain.com',
    language: 'zh-CN',
    pubDate: new Date(),
    ttl: '60'
  });

  // 添加最新文章
  const articles = getLatestArticles();
  articles.forEach(article => {
    feed.item({
      title: article.title,
      description: article.summary,
      url: `https://your-domain.com/articles/${article.id}`,
      date: article.date
    });
  });

  // 生成 RSS 文件
  fs.writeFileSync('./public/rss.xml', feed.xml());
  console.log('✅ RSS 订阅已更新');
}

function getLatestArticles() {
  // 从内容管理系统获取最新文章
  return [];
}

module.exports = generateRSS;
```

## 2. 系统自动化备份

### 2.1 数据库备份脚本

创建 `scripts/backup.sh`：

```bash
#!/bin/bash

# 自动备份脚本
# 使用方法：./backup.sh

set -e

# 配置变量
BACKUP_DIR="/backup"
WEBSITE_DIR="/var/www/your-domain.com"
DB_NAME="your_database"
DB_USER="your_user"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR/{website,database,logs}

echo "🗄️ 开始自动备份 - $DATE"

# 1. 备份网站文件
echo "📁 备份网站文件..."
tar -czf $BACKUP_DIR/website/website_$DATE.tar.gz $WEBSITE_DIR
echo "✅ 网站文件备份完成"

# 2. 备份数据库（如果有）
if command -v mysqldump &> /dev/null; then
    echo "🗃️ 备份数据库..."
    mysqldump -u $DB_USER -p $DB_NAME > $BACKUP_DIR/database/db_$DATE.sql
    gzip $BACKUP_DIR/database/db_$DATE.sql
    echo "✅ 数据库备份完成"
fi

# 3. 备份日志文件
echo "📋 备份日志文件..."
tar -czf $BACKUP_DIR/logs/logs_$DATE.tar.gz /var/log/nginx/
echo "✅ 日志备份完成"

# 4. 上传到云存储（阿里云 OSS 示例）
if command -v ossutil &> /dev/null; then
    echo "☁️ 上传到云存储..."
    ossutil cp -r $BACKUP_DIR/website/website_$DATE.tar.gz oss://your-bucket/backups/
    ossutil cp -r $BACKUP_DIR/database/db_$DATE.sql.gz oss://your-bucket/backups/
    echo "✅ 云存储上传完成"
fi

# 5. 清理旧备份
echo "🧹 清理旧备份..."
find $BACKUP_DIR -name "website_*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "logs_*.tar.gz" -mtime +$RETENTION_DAYS -delete
echo "✅ 旧备份清理完成"

# 6. 发送备份报告
echo "📧 发送备份报告..."
BACKUP_SIZE=$(du -sh $BACKUP_DIR/website/website_$DATE.tar.gz | cut -f1)
echo "备份完成 - $DATE
网站备份大小: $BACKUP_SIZE
备份位置: $BACKUP_DIR" | mail -s "网站备份报告 - $DATE" your-email@example.com

echo "🎉 自动备份完成 - $DATE"
```

### 2.2 增量备份脚本

创建 `scripts/incremental-backup.sh`：

```bash
#!/bin/bash

# 增量备份脚本 - 只备份变更的文件
# 使用 rsync 进行增量同步

WEBSITE_DIR="/var/www/your-domain.com"
BACKUP_BASE="/backup/incremental"
DATE=$(date +%Y%m%d)
CURRENT_BACKUP="$BACKUP_BASE/backup_$DATE"
LATEST_LINK="$BACKUP_BASE/latest"

echo "🔄 开始增量备份 - $DATE"

# 创建备份目录
mkdir -p $CURRENT_BACKUP

# 增量备份（硬链接节省空间）
if [ -d "$LATEST_LINK" ]; then
    rsync -av --delete --link-dest="$LATEST_LINK" "$WEBSITE_DIR/" "$CURRENT_BACKUP/"
else
    rsync -av "$WEBSITE_DIR/" "$CURRENT_BACKUP/"
fi

# 更新最新备份链接
rm -f "$LATEST_LINK"
ln -s "$CURRENT_BACKUP" "$LATEST_LINK"

echo "✅ 增量备份完成 - $DATE"
```

## 3. 监控和告警

### 3.1 网站监控脚本

创建 `scripts/monitor.sh`：

```bash
#!/bin/bash

# 网站监控脚本
# 检查网站可用性、性能和安全性

WEBSITE_URL="https://your-domain.com"
LOG_FILE="/var/log/website-monitor.log"
ALERT_EMAIL="your-email@example.com"

echo "🔍 开始网站监控 - $(date)"

# 1. 检查网站可用性
check_availability() {
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $WEBSITE_URL)
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" $WEBSITE_URL)
    
    if [ "$HTTP_CODE" != "200" ]; then
        echo "❌ 网站不可访问 - HTTP $HTTP_CODE" | tee -a $LOG_FILE
        send_alert "网站不可访问" "HTTP状态码: $HTTP_CODE"
        return 1
    fi
    
    # 检查响应时间
    if (( $(echo "$RESPONSE_TIME > 3.0" | bc -l) )); then
        echo "⚠️ 网站响应缓慢 - ${RESPONSE_TIME}s" | tee -a $LOG_FILE
        send_alert "网站响应缓慢" "响应时间: ${RESPONSE_TIME}秒"
    fi
    
    echo "✅ 网站可用性正常 - ${RESPONSE_TIME}s" | tee -a $LOG_FILE
}

# 2. 检查 SSL 证书
check_ssl() {
    CERT_EXPIRY=$(echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    EXPIRY_DATE=$(date -d "$CERT_EXPIRY" +%s)
    CURRENT_DATE=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_DATE - $CURRENT_DATE) / 86400 ))
    
    if [ $DAYS_LEFT -lt 30 ]; then
        echo "⚠️ SSL证书即将过期 - $DAYS_LEFT 天" | tee -a $LOG_FILE
        send_alert "SSL证书即将过期" "剩余天数: $DAYS_LEFT"
    else
        echo "✅ SSL证书正常 - 剩余 $DAYS_LEFT 天" | tee -a $LOG_FILE
    fi
}

# 3. 检查磁盘空间
check_disk_space() {
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ $DISK_USAGE -gt 80 ]; then
        echo "⚠️ 磁盘空间不足 - ${DISK_USAGE}%" | tee -a $LOG_FILE
        send_alert "磁盘空间不足" "使用率: ${DISK_USAGE}%"
    else
        echo "✅ 磁盘空间正常 - ${DISK_USAGE}%" | tee -a $LOG_FILE
    fi
}

# 4. 检查内存使用
check_memory() {
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    
    if [ $MEMORY_USAGE -gt 90 ]; then
        echo "⚠️ 内存使用过高 - ${MEMORY_USAGE}%" | tee -a $LOG_FILE
        send_alert "内存使用过高" "使用率: ${MEMORY_USAGE}%"
    else
        echo "✅ 内存使用正常 - ${MEMORY_USAGE}%" | tee -a $LOG_FILE
    fi
}

# 5. 检查 Nginx 状态
check_nginx() {
    if ! systemctl is-active --quiet nginx; then
        echo "❌ Nginx 服务异常" | tee -a $LOG_FILE
        send_alert "Nginx服务异常" "服务已停止"
        
        # 尝试重启
        systemctl restart nginx
        if systemctl is-active --quiet nginx; then
            echo "✅ Nginx 服务已重启" | tee -a $LOG_FILE
        fi
    else
        echo "✅ Nginx 服务正常" | tee -a $LOG_FILE
    fi
}

# 发送告警
send_alert() {
    SUBJECT="$1"
    MESSAGE="$2"
    
    echo "告警时间: $(date)
网站: $WEBSITE_URL
问题: $SUBJECT
详情: $MESSAGE" | mail -s "网站监控告警: $SUBJECT" $ALERT_EMAIL
}

# 执行所有检查
check_availability
check_ssl
check_disk_space
check_memory
check_nginx

echo "🎉 监控检查完成 - $(date)"
```

### 3.2 性能监控脚本

创建 `scripts/performance-monitor.js`：

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');

class PerformanceMonitor {
  constructor(url) {
    this.url = url;
    this.logFile = '/var/log/performance.log';
  }

  async runAudit() {
    console.log('🚀 开始性能监控...');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 监听性能指标
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = {};
    });
    
    const startTime = Date.now();
    await page.goto(this.url, { waitUntil: 'networkidle2' });
    const loadTime = Date.now() - startTime;
    
    // 获取 Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.name === 'FCP') vitals.fcp = entry.value;
            if (entry.name === 'LCP') vitals.lcp = entry.value;
            if (entry.name === 'FID') vitals.fid = entry.value;
            if (entry.name === 'CLS') vitals.cls = entry.value;
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['measure', 'navigation'] });
        
        // 超时处理
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    await browser.close();
    
    // 记录性能数据
    const performanceData = {
      timestamp: new Date().toISOString(),
      url: this.url,
      loadTime,
      metrics
    };
    
    this.logPerformance(performanceData);
    this.checkThresholds(performanceData);
    
    console.log('✅ 性能监控完成');
  }

  logPerformance(data) {
    const logEntry = `${data.timestamp} - Load: ${data.loadTime}ms, FCP: ${data.metrics.fcp}ms, LCP: ${data.metrics.lcp}ms\n`;
    fs.appendFileSync(this.logFile, logEntry);
  }

  checkThresholds(data) {
    const alerts = [];
    
    if (data.loadTime > 3000) {
      alerts.push(`页面加载时间过长: ${data.loadTime}ms`);
    }
    
    if (data.metrics.lcp > 2500) {
      alerts.push(`LCP 过高: ${data.metrics.lcp}ms`);
    }
    
    if (data.metrics.cls > 0.1) {
      alerts.push(`CLS 过高: ${data.metrics.cls}`);
    }
    
    if (alerts.length > 0) {
      this.sendPerformanceAlert(alerts);
    }
  }

  sendPerformanceAlert(alerts) {
    // 发送性能告警邮件
    console.log('⚠️ 性能告警:', alerts.join(', '));
  }
}

// 运行监控
if (require.main === module) {
  const monitor = new PerformanceMonitor('https://your-domain.com');
  monitor.runAudit().catch(console.error);
}

module.exports = PerformanceMonitor;
```

## 4. 安全自动化

### 4.1 安全扫描脚本

创建 `scripts/security-scan.sh`：

```bash
#!/bin/bash

# 安全扫描脚本
# 检查常见安全问题

WEBSITE_URL="https://your-domain.com"
LOG_FILE="/var/log/security-scan.log"

echo "🔒 开始安全扫描 - $(date)"

# 1. 检查 HTTP 安全头
check_security_headers() {
    echo "🛡️ 检查安全头..."
    
    HEADERS=$(curl -s -I $WEBSITE_URL)
    
    # 检查必要的安全头
    if ! echo "$HEADERS" | grep -q "X-Frame-Options"; then
        echo "⚠️ 缺少 X-Frame-Options 头" | tee -a $LOG_FILE
    fi
    
    if ! echo "$HEADERS" | grep -q "X-XSS-Protection"; then
        echo "⚠️ 缺少 X-XSS-Protection 头" | tee -a $LOG_FILE
    fi
    
    if ! echo "$HEADERS" | grep -q "X-Content-Type-Options"; then
        echo "⚠️ 缺少 X-Content-Type-Options 头" | tee -a $LOG_FILE
    fi
    
    if ! echo "$HEADERS" | grep -q "Strict-Transport-Security"; then
        echo "⚠️ 缺少 HSTS 头" | tee -a $LOG_FILE
    fi
}

# 2. 检查 SSL 配置
check_ssl_config() {
    echo "🔐 检查 SSL 配置..."
    
    # 使用 testssl.sh 进行详细检查
    if command -v testssl.sh &> /dev/null; then
        testssl.sh --quiet --jsonfile /tmp/ssl-report.json $WEBSITE_URL
        
        # 分析结果
        if grep -q "HIGH\|CRITICAL" /tmp/ssl-report.json; then
            echo "❌ SSL 配置存在高危问题" | tee -a $LOG_FILE
        else
            echo "✅ SSL 配置正常" | tee -a $LOG_FILE
        fi
    fi
}

# 3. 检查开放端口
check_open_ports() {
    echo "🔍 检查开放端口..."
    
    # 扫描常见端口
    nmap -sS -O localhost | tee -a $LOG_FILE
}

# 4. 检查文件权限
check_file_permissions() {
    echo "📁 检查文件权限..."
    
    # 检查敏感文件权限
    find /var/www -type f -perm /o+w | tee -a $LOG_FILE
    find /etc/nginx -type f -perm /o+w | tee -a $LOG_FILE
}

# 5. 检查系统更新
check_system_updates() {
    echo "🔄 检查系统更新..."
    
    apt list --upgradable 2>/dev/null | grep -v "WARNING" | tee -a $LOG_FILE
}

# 执行所有检查
check_security_headers
check_ssl_config
check_open_ports
check_file_permissions
check_system_updates

echo "🎉 安全扫描完成 - $(date)"
```

### 4.2 自动安全更新

创建 `scripts/auto-update.sh`：

```bash
#!/bin/bash

# 自动安全更新脚本

echo "🔄 开始自动安全更新 - $(date)"

# 1. 更新包列表
apt update

# 2. 只安装安全更新
unattended-upgrade -d

# 3. 清理不需要的包
apt autoremove -y
apt autoclean

# 4. 重启服务（如果需要）
if [ -f /var/run/reboot-required ]; then
    echo "⚠️ 系统需要重启" | mail -s "系统重启提醒" your-email@example.com
fi

echo "✅ 安全更新完成 - $(date)"
```

## 5. 定时任务配置

### 5.1 Crontab 配置

```bash
# 编辑 crontab
sudo crontab -e

# 添加以下任务
# 每天凌晨 2 点备份
0 2 * * * /path/to/scripts/backup.sh

# 每 6 小时增量备份
0 */6 * * * /path/to/scripts/incremental-backup.sh

# 每 15 分钟监控检查
*/15 * * * * /path/to/scripts/monitor.sh

# 每小时性能检查
0 * * * * node /path/to/scripts/performance-monitor.js

# 每天凌晨 3 点安全扫描
0 3 * * * /path/to/scripts/security-scan.sh

# 每周日凌晨 4 点安全更新
0 4 * * 0 /path/to/scripts/auto-update.sh

# 每天凌晨 1 点内容同步
0 1 * * * node /path/to/scripts/content-sync.js

# 每小时生成 RSS
0 * * * * node /path/to/scripts/rss-generator.js
```

### 5.2 Systemd 服务配置

创建 `/etc/systemd/system/website-monitor.service`：

```ini
[Unit]
Description=Website Monitor Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/your-domain.com
ExecStart=/path/to/scripts/monitor.sh
Restart=always
RestartSec=300

[Install]
WantedBy=multi-user.target
```

启用服务：
```bash
sudo systemctl enable website-monitor.service
sudo systemctl start website-monitor.service
```

## 6. 日志管理

### 6.1 日志轮转配置

创建 `/etc/logrotate.d/website`：

```
/var/log/website-*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

### 6.2 日志分析脚本

创建 `scripts/log-analysis.sh`：

```bash
#!/bin/bash

# 日志分析脚本
# 分析访问日志，生成报告

LOG_FILE="/var/log/nginx/access.log"
REPORT_FILE="/var/log/website-report-$(date +%Y%m%d).txt"

echo "📊 生成网站访问报告 - $(date)" > $REPORT_FILE

# 1. 访问量统计
echo "=== 访问量统计 ===" >> $REPORT_FILE
echo "今日总访问量: $(grep "$(date +%d/%b/%Y)" $LOG_FILE | wc -l)" >> $REPORT_FILE
echo "今日独立IP: $(grep "$(date +%d/%b/%Y)" $LOG_FILE | awk '{print $1}' | sort | uniq | wc -l)" >> $REPORT_FILE

# 2. 热门页面
echo "=== 热门页面 ===" >> $REPORT_FILE
grep "$(date +%d/%b/%Y)" $LOG_FILE | awk '{print $7}' | sort | uniq -c | sort -nr | head -10 >> $REPORT_FILE

# 3. 访问来源
echo "=== 访问来源 ===" >> $REPORT_FILE
grep "$(date +%d/%b/%Y)" $LOG_FILE | awk '{print $1}' | sort | uniq -c | sort -nr | head -10 >> $REPORT_FILE

# 4. 错误统计
echo "=== 错误统计 ===" >> $REPORT_FILE
grep "$(date +%d/%b/%Y)" $LOG_FILE | awk '$9 >= 400' | awk '{print $9}' | sort | uniq -c >> $REPORT_FILE

# 发送报告
mail -s "网站访问报告 - $(date +%Y%m%d)" your-email@example.com < $REPORT_FILE
```

## 7. 故障自动恢复

### 7.1 服务自动重启

创建 `scripts/auto-recovery.sh`：

```bash
#!/bin/bash

# 自动故障恢复脚本

# 检查并重启 Nginx
if ! systemctl is-active --quiet nginx; then
    echo "🔄 重启 Nginx 服务..."
    systemctl restart nginx
    
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx 重启成功"
    else
        echo "❌ Nginx 重启失败" | mail -s "Nginx 重启失败" your-email@example.com
    fi
fi

# 检查磁盘空间，自动清理
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "🧹 磁盘空间不足，开始清理..."
    
    # 清理日志文件
    find /var/log -name "*.log" -mtime +7 -delete
    
    # 清理临时文件
    find /tmp -mtime +3 -delete
    
    # 清理包缓存
    apt clean
    
    echo "✅ 磁盘清理完成"
fi
```

## 8. 监控面板

### 8.1 简单监控面板

创建 `public/monitor.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <title>网站监控面板</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .ok { background-color: #d4edda; color: #155724; }
        .warning { background-color: #fff3cd; color: #856404; }
        .error { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>HUANG / POESIA 网站监控</h1>
    
    <div id="status-container">
        <div class="status ok">
            <strong>网站状态:</strong> <span id="website-status">检查中...</span>
        </div>
        
        <div class="status ok">
            <strong>SSL证书:</strong> <span id="ssl-status">检查中...</span>
        </div>
        
        <div class="status ok">
            <strong>响应时间:</strong> <span id="response-time">检查中...</span>
        </div>
        
        <div class="status ok">
            <strong>最后更新:</strong> <span id="last-update">检查中...</span>
        </div>
    </div>

    <script>
        // 定期更新状态
        setInterval(updateStatus, 60000);
        updateStatus();

        function updateStatus() {
            fetch('/api/status')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('website-status').textContent = data.website;
                    document.getElementById('ssl-status').textContent = data.ssl;
                    document.getElementById('response-time').textContent = data.responseTime + 'ms';
                    document.getElementById('last-update').textContent = new Date().toLocaleString();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    </script>
</body>
</html>
```

## 总结

通过以上自动化维护方案，您的网站将能够：

1. **自动内容更新** - 从各平台同步内容
2. **自动备份** - 定期备份网站和数据
3. **自动监控** - 24/7 监控网站状态
4. **自动安全** - 定期安全扫描和更新
5. **自动恢复** - 故障时自动修复
6. **自动报告** - 定期生成运营报告

这样您就可以专注于内容创作，而不用担心技术维护问题！

