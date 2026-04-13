# VPS Installation Guide - AlmaLinux

## Prerequisites
- AlmaLinux 8/9 (atau distro RHEL lain)
- Apache sudah terinstall
- MySQL sudah terinstall
- Node.js sudah terinstall
- Domain sudah pointing ke VPS

---

## Directory Structure

Project akan diinstall di:
```
/home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/
```

---

## 1. Upload Project ke VPS

Dari komputer lokal (Windows), gunakan SCP:

```bash
scp -r C:/xampp/htdocs/mahasiswa/* user@your-vps:/home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/
```

Atau jika sudah di server, clone/pull dari git repository.

---

## 2. Setup Project

```bash
# Masuk ke direktori project
cd /home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/

# Install dependencies
npm install

# Build project
npm run build
```

---

## 3. Buat Database MySQL

```bash
mysql -u root -p
```

```sql
CREATE DATABASE maha_mahasiswa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'maha_mahasiswa'@'localhost' IDENTIFIED BY 'Mahasiswa2026!';
GRANT ALL PRIVILEGES ON maha_mahasiswa.* TO 'maha_mahasiswa'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Atau import file SQL langsung:
```bash
mysql -u root -p < /home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/sql/schema.sql
```

---

## 4. Konfigurasi Environment Variables

```bash
nano /home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/.env
```

```env
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="maha_mahasiswa"
DB_PASSWORD="Mahasiswa2026!"
DB_NAME="maha_mahasiswa"
DB_SSL="false"

GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

APP_URL="https://mahasiswa.visiteknologi.tech"
```

---

## 5. Push Schema ke Database

```bash
cd /home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/
npm run db:push
```

---

## 6. Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start app
cd /home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/
pm2 start dist/server/entry.mjs --name "mahasiswa"

# Auto-start on reboot
pm2 startup
pm2 save

# Cek status
pm2 status
pm2 logs mahasiswa
```

---

## 7. Konfigurasi Apache (Reverse Proxy)

### Enable required modules
```bash
sudo nano /etc/httpd/conf.modules.d/00-proxy.conf
```

Pastikan module ini ter-load:
```
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule ssl_module modules/mod_ssl.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
```

### Create vhost config
```bash
sudo nano /etc/httpd/conf.d/mahasiswa.conf
```

```apache
<VirtualHost *:80>
    ServerName mahasiswa.visiteknologi.tech
    ServerAlias www.mahasiswa.visiteknologi.tech
    
    # Redirect HTTP to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^/?(.*) https://%{SERVER_NAME}/$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName mahasiswa.visiteknologi.tech
    ServerAlias www.mahasiswa.visiteknologi.tech
    
    SSLEngine on
    SSLCertificateFile /etc/pki/tls/certs/mahasiswa.visiteknologi.tech.crt
    SSLCertificateKeyFile /etc/pki/tls/private/mahasiswa.visiteknologi.tech.key
    
    # Security headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    
    # Proxy to Node.js app (port 4321)
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:4321/
    ProxyPassReverse / http://127.0.0.1:4321/
    
    ErrorLog /var/log/httpd/mahasiswa_error.log
    CustomLog /var/log/httpd/mahasiswa_access.log combined
</VirtualHost>
```

### Test & restart Apache
```bash
sudo apachectl configtest
sudo systemctl restart httpd
```

---

## 8. Firewall

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=4321/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

---

## 9. SELinux (AlmaLinux)

```bash
# Set permissive (jika ada masalah)
sudo setenforce 0

# Atau allow httpd network
sudo setsebool -P httpd_can_network_connect 1
```

---

## 10. SSL Certificate (Let's Encrypt)

```bash
sudo dnf install -y epel-release
sudo dnf install -y certbot python3-certbot-apache

# Stop Apache sementara
sudo systemctl stop httpd

# Get certificate
sudo certbot certonly --standalone -d mahasiswa.visiteknologi.tech -d www.mahasiswa.visiteknologi.tech

# Start Apache
sudo systemctl start httpd
```

### Update SSL paths di Apache config:
```bash
sudo nano /etc/httpd/conf.d/mahasiswa.conf
```

```apache
SSLCertificateFile /etc/letsencrypt/live/mahasiswa.visiteknologi.tech/fullchain.pem
SSLCertificateKeyFile /etc/letsencrypt/live/mahasiswa.visiteknologi.tech/privkey.pem
```

```bash
sudo systemctl restart httpd
```

### Auto-renewal:
```bash
sudo crontab -e
```

```
0 0 * * * certbot renew --quiet
```

---

## Quick Commands

```bash
# Deploy update
cd /home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/
git pull
npm install
npm run build
pm2 restart mahasiswa

# Cek app
pm2 status
pm2 logs mahasiswa

# Cek Apache
sudo systemctl status httpd
tail -f /var/log/httpd/mahasiswa_error.log

# Restart semua
sudo systemctl restart httpd
pm2 restart mahasiswa
```

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Credentials > OAuth Client ID
5. Authorized origins:
   - `https://mahasiswa.visiteknologi.tech`
6. Authorized redirect URIs:
   - `https://mahasiswa.visiteknologi.tech/api/auth/callback`
7. Copy Client ID dan Secret ke `.env`

---

## Troubleshooting

### App tidak jalan?
```bash
pm2 status
pm2 logs mahasiswa
curl http://127.0.0.1:4321
```

### Database error?
```bash
mysql -u maha_mahasiswa -p maha_mahasiswa
SHOW TABLES;
```

### Apache error?
```bash
sudo tail -f /var/log/httpd/mahasiswa_error.log
sudo apachectl configtest
```

---

## Update Chain (Deploy)

```bash
# 1. Upload file baru
scp -r ./mahasiswa/* user@vps:/home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/

# 2. SSH ke server
ssh user@vps

# 3. Install & build
cd /home/mahasiswa.visiteknologi.tech/public_html/mahasiswa/
npm install
npm run build

# 4. Restart PM2
pm2 restart mahasiswa
```

---

## Database Credentials

- **Database Name:** maha_mahasiswa
- **Username:** maha_mahasiswa
- **Password:** Mahasiswa2026!
- **Host:** localhost