#!/bin/bash

# Detener servicios existentes
pm2 stop axiloop || true
sudo systemctl stop fiscal-bridge || true

# Actualizar código
git pull origin main

# Instalar dependencias
npm install --production

# Construir la aplicación
npm run build

# Iniciar servicios
pm2 start npm --name "axiloop" -- start
sudo systemctl start fiscal-bridge

# Asegurar que los servicios inicien con el sistema
pm2 save
sudo systemctl enable fiscal-bridge

# Reiniciar Nginx
sudo systemctl restart nginx