#!/bin/bash

# BlueLobsters.io Deployment Script
echo "🚀 BlueLobsters Deployment Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js v16 o superior."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js versión $NODE_VERSION detectada. Se requiere v16 o superior."
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Create necessary directories
echo "📁 Creando directorios necesarios..."
mkdir -p logs
mkdir -p database
mkdir -p backups

# Install dependencies
echo "📦 Instalando dependencias de producción..."
npm ci --only=production

# Copy production environment file
if [ -f ".env.production" ]; then
    echo "🔧 Configurando variables de entorno de producción..."
    cp .env.production .env
else
    echo "⚠️  Archivo .env.production no encontrado. Usando configuración por defecto."
fi

# Set proper permissions
echo "🔒 Configurando permisos..."
chmod 755 server.js
chmod 755 database/
chmod 644 database/users.db 2>/dev/null || echo "ℹ️  Base de datos será creada automáticamente"

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2 globalmente..."
    npm install -g pm2
fi

# Start or restart the application
echo "🔄 Iniciando aplicación con PM2..."

# Stop existing process if running
pm2 stop bluelobsters 2>/dev/null || echo "ℹ️  No hay procesos previos ejecutándose"

# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (para que se inicie automáticamente)
pm2 startup | tail -1 | bash 2>/dev/null || echo "ℹ️  Configuración de startup de PM2 omitida (requiere sudo)"

echo ""
echo "✅ Deployment completado!"
echo ""
echo "📊 Estado de la aplicación:"
pm2 status

echo ""
echo "🌐 La aplicación debería estar disponible en:"
echo "   http://$(hostname):3000"
echo "   https://bluelobsters.io (si está configurado)"
echo ""
echo "📋 Comandos útiles:"
echo "   pm2 logs bluelobsters    # Ver logs"
echo "   pm2 restart bluelobsters # Reiniciar app"
echo "   pm2 stop bluelobsters    # Detener app"
echo "   pm2 monit               # Monitor en tiempo real"
echo ""
echo "🔒 Recuerda:"
echo "   1. Configurar HTTPS en el servidor web (nginx/apache)"
echo "   2. Cambiar JWT_SECRET en .env por algo más seguro"
echo "   3. Configurar backups automáticos de la base de datos"
echo "   4. Configurar firewall para permitir solo puertos necesarios"