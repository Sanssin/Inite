#!/bin/bash
# ============================================
# Deployment Script - Inite (Nuclear Radiation Simulation)
# Domain: inite-polteknuklir.site
# Server IP: 202.10.47.69
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="/root/Inite"
DOMAIN="inite-polteknuklir.site"
SERVER_IP="202.10.47.69"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} Inite Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"

# ---- Step 1: Update system & install dependencies ----
echo -e "${YELLOW}[1/8] Updating system & installing dependencies...${NC}"
apt update && apt upgrade -y
apt install -y nginx python3 python3-pip python3-venv nodejs npm certbot python3-certbot-nginx curl git

# Check Node.js version, install newer if needed
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${YELLOW}Installing Node.js 18 LTS...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

echo -e "${GREEN}[1/8] Done!${NC}"

# ---- Step 2: Setup Python virtual environment & install API deps ----
echo -e "${YELLOW}[2/8] Setting up Python API...${NC}"
cd "$PROJECT_DIR/api"

python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

deactivate
echo -e "${GREEN}[2/8] Done!${NC}"

# ---- Step 3: Build React frontend ----
echo -e "${YELLOW}[3/8] Building React frontend...${NC}"
cd "$PROJECT_DIR"
npm install
npm run build
echo -e "${GREEN}[3/8] Done!${NC}"

# ---- Step 4: Create systemd service for FastAPI ----
echo -e "${YELLOW}[4/8] Creating FastAPI systemd service...${NC}"
cat > /etc/systemd/system/inite-api.service << 'EOF'
[Unit]
Description=Inite FastAPI Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/Inite/api
Environment=PATH=/root/Inite/api/venv/bin:/usr/bin
ExecStart=/root/Inite/api/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable inite-api
systemctl restart inite-api
echo -e "${GREEN}[4/8] Done!${NC}"

# ---- Step 5: Configure Nginx (HTTP only first) ----
echo -e "${YELLOW}[5/8] Configuring Nginx...${NC}"

# Remove default site
rm -f /etc/nginx/sites-enabled/default

cat > /etc/nginx/sites-available/inite << EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN} ${SERVER_IP};

    # React frontend (static files)
    root ${PROJECT_DIR}/build;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
    }

    # React Router - serve index.html for all non-file routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/inite /etc/nginx/sites-enabled/inite

# Test and reload Nginx
nginx -t
systemctl enable nginx
systemctl restart nginx
echo -e "${GREEN}[5/8] Done!${NC}"

# ---- Step 6: Configure Firewall ----
echo -e "${YELLOW}[6/8] Configuring firewall...${NC}"
if ! command -v ufw &> /dev/null; then
    echo "Installing ufw..."
    apt install -y ufw
fi
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo -e "${GREEN}[6/8] Done!${NC}"

# ---- Step 7: SSL Certificate with Let's Encrypt ----
echo -e "${YELLOW}[7/8] Setting up SSL certificate...${NC}"
echo ""
echo -e "${RED}PENTING: Pastikan domain ${DOMAIN} sudah di-pointing ke IP ${SERVER_IP}${NC}"
echo -e "${RED}Sebelum menjalankan step ini!${NC}"
echo ""
read -p "Apakah domain sudah di-pointing ke IP server? (y/n): " dns_ready

if [ "$dns_ready" = "y" ] || [ "$dns_ready" = "Y" ]; then
    certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} || {
        echo -e "${YELLOW}SSL setup gagal. Anda bisa jalankan manual nanti:${NC}"
        echo "  certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
    }
    echo -e "${GREEN}[7/8] SSL Done!${NC}"
else
    echo -e "${YELLOW}[7/8] Skipped SSL. Jalankan perintah ini setelah DNS ready:${NC}"
    echo "  certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
fi

# ---- Step 8: Verify deployment ----
echo -e "${YELLOW}[8/8] Verifying deployment...${NC}"
sleep 2

# Check API
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/ 2>/dev/null || echo "000")
if [ "$API_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ API Backend: Running (port 8000)${NC}"
else
    echo -e "${RED}❌ API Backend: Not responding (status: $API_STATUS)${NC}"
    echo "   Check logs: journalctl -u inite-api -n 50"
fi

# Check Nginx
NGINX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null || echo "000")
if [ "$NGINX_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Nginx Frontend: Running (port 80)${NC}"
else
    echo -e "${RED}❌ Nginx Frontend: Not responding (status: $NGINX_STATUS)${NC}"
    echo "   Check logs: tail -20 /var/log/nginx/error.log"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Website: http://${DOMAIN}"
echo -e "API:     http://${DOMAIN}/api/"
echo -e "IP:      http://${SERVER_IP}"
echo ""
echo -e "${YELLOW}Perintah berguna:${NC}"
echo "  systemctl status inite-api    # Cek status API"
echo "  systemctl restart inite-api   # Restart API"
echo "  journalctl -u inite-api -f    # Log API realtime"
echo "  systemctl restart nginx       # Restart Nginx"
echo "  tail -f /var/log/nginx/error.log  # Log Nginx"
echo ""
echo -e "${YELLOW}Untuk update deployment:${NC}"
echo "  cd /root/Inite && git pull"
echo "  npm run build"
echo "  systemctl restart inite-api"
echo "  systemctl restart nginx"
