# 云服务器部署配置示例

## 阿里云 ECS 部署

### 1. 服务器配置
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Nginx
sudo apt install nginx -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2（可选，用于进程管理）
sudo npm install -g pm2
```

### 2. 上传网站文件
```bash
# 创建网站目录
sudo mkdir -p /var/www/your-domain.com
sudo chown -R $USER:$USER /var/www/your-domain.com

# 上传 dist 文件夹内容到服务器
# 可以使用 scp、rsync 或 FTP 工具
scp -r dist/* user@your-server-ip:/var/www/your-domain.com/
```

### 3. Nginx 配置
```bash
# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/your-domain.com
```

配置内容：
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/your-domain.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4. 启用网站
```bash
# 启用网站配置
sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 5. SSL 证书配置
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 设置自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 腾讯云 CVM 部署

### 1. 安全组配置
- 开放 80 端口（HTTP）
- 开放 443 端口（HTTPS）
- 开放 22 端口（SSH）

### 2. 域名解析
在腾讯云 DNS 控制台添加：
```
记录类型: A
主机记录: @
记录值: 服务器公网IP
TTL: 600

记录类型: CNAME
主机记录: www
记录值: your-domain.com
TTL: 600
```

## Docker 部署（可选）

### Dockerfile
```dockerfile
FROM nginx:alpine

# 复制构建文件
COPY dist/ /usr/share/nginx/html/

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  website:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    restart: unless-stopped
```

### 部署命令
```bash
# 构建镜像
docker build -t huang-poesia-website .

# 运行容器
docker run -d -p 80:80 --name huang-website huang-poesia-website

# 或使用 docker-compose
docker-compose up -d
```

## 监控和维护

### 1. 日志监控
```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 2. 性能监控
```bash
# 安装 htop
sudo apt install htop

# 查看系统资源
htop

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

### 3. 备份脚本
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"
WEBSITE_DIR="/var/www/your-domain.com"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份网站文件
tar -czf $BACKUP_DIR/website_$DATE.tar.gz $WEBSITE_DIR

# 删除 30 天前的备份
find $BACKUP_DIR -name "website_*.tar.gz" -mtime +30 -delete

echo "Backup completed: website_$DATE.tar.gz"
```

### 4. 自动部署脚本
```bash
#!/bin/bash
# auto-deploy.sh

WEBSITE_DIR="/var/www/your-domain.com"
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份当前版本
tar -czf $BACKUP_DIR/website_backup_$DATE.tar.gz $WEBSITE_DIR

# 下载新版本（从 Git 或其他源）
cd /tmp
wget https://your-domain.com/releases/latest.tar.gz
tar -xzf latest.tar.gz

# 更新网站文件
sudo rm -rf $WEBSITE_DIR/*
sudo cp -r dist/* $WEBSITE_DIR/

# 重启 Nginx
sudo systemctl reload nginx

echo "Deployment completed at $DATE"
```

## 故障排除

### 常见问题
1. **403 Forbidden**：检查文件权限和 Nginx 配置
2. **502 Bad Gateway**：检查 Nginx 配置和上游服务
3. **SSL 证书问题**：检查证书路径和有效期
4. **域名解析问题**：检查 DNS 配置和传播状态

### 调试命令
```bash
# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 状态
sudo systemctl status nginx

# 检查端口占用
sudo netstat -tlnp | grep :80

# 检查防火墙状态
sudo ufw status

# 测试域名解析
nslookup your-domain.com
dig your-domain.com
```

