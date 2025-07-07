# 🚀 Guía de Deployment para BlueLobsters.io

Esta guía te ayudará a subir el sistema de autenticación de BlueLobsters a un servidor de producción.

## 📋 Prerrequisitos del Servidor

### Sistema Operativo
- Ubuntu 20.04 LTS o superior (recomendado)
- CentOS 8+ o Rocky Linux
- Debian 11+

### Software Requerido
- **Node.js**: v16 o superior
- **npm**: v8 o superior
- **PM2**: Gestor de procesos
- **Nginx**: Servidor web (opcional pero recomendado)
- **SSL Certificate**: Para HTTPS

## 🛠️ Instalación Paso a Paso

### 1. Preparar el Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias básicas
sudo apt install -y curl wget git unzip

# Instalar Node.js (método recomendado con NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 2. Instalar PM2 Globalmente

```bash
sudo npm install -g pm2
```

### 3. Subir Archivos del Proyecto

#### Opción A: Via Git (Recomendado)
```bash
# Clonar repositorio (si tienes uno)
git clone https://github.com/tu-usuario/bluelobsters.io.git
cd bluelobsters.io
```

#### Opción B: Via SFTP/SCP
```bash
# Subir archivos al servidor
scp -r bluelobsters.io/ usuario@servidor:/var/www/bluelobsters.io/
```

### 4. Configurar el Proyecto

```bash
# Ir al directorio del proyecto
cd /var/www/bluelobsters.io

# Instalar dependencias de producción
npm ci --only=production

# Configurar variables de entorno
cp .env.production .env

# IMPORTANTE: Editar .env con datos seguros
nano .env
```

### 5. Ejecutar el Deployment

```bash
# Hacer el script ejecutable
chmod +x deploy.sh

# Ejecutar deployment
./deploy.sh
```

## 🔧 Configuración de Nginx (Recomendado)

### 1. Instalar Nginx

```bash
sudo apt install -y nginx
```

### 2. Configurar Virtual Host

```bash
# Copiar configuración
sudo cp nginx.conf /etc/nginx/sites-available/bluelobsters.io

# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/bluelobsters.io /etc/nginx/sites-enabled/

# Eliminar configuración por defecto
sudo rm /etc/nginx/sites-enabled/default

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 3. Configurar SSL (HTTPS)

#### Opción A: Let's Encrypt (Gratis)
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d bluelobsters.io -d www.bluelobsters.io

# Configurar renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Opción B: Certificado Comercial
```bash
# Subir certificados al servidor
sudo mkdir -p /etc/ssl/certs /etc/ssl/private
sudo cp bluelobsters.io.crt /etc/ssl/certs/
sudo cp bluelobsters.io.key /etc/ssl/private/
sudo chmod 600 /etc/ssl/private/bluelobsters.io.key
```

## 🔐 Configuración de Seguridad

### 1. Variables de Entorno Seguras

```bash
# Editar .env con valores seguros
nano .env
```

```env
# Generar JWT secret seguro (ejemplo)
JWT_SECRET=tu_clave_super_secreta_y_aleatoria_de_al_menos_32_caracteres

# Configurar para producción
NODE_ENV=production
PORT=3000
SECURE_COOKIES=true
HTTPS_ONLY=true
```

### 2. Configurar Firewall

```bash
# Configurar UFW (Ubuntu Firewall)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3000/tcp  # Solo acceso interno para Node.js
```

### 3. Configurar Permisos

```bash
# Crear usuario para la aplicación
sudo useradd -r -s /bin/false bluelobsters

# Cambiar propietario de archivos
sudo chown -R bluelobsters:bluelobsters /var/www/bluelobsters.io

# Configurar permisos
sudo chmod 755 /var/www/bluelobsters.io
sudo chmod 644 /var/www/bluelobsters.io/database/users.db
```

## 📊 Monitoreo y Mantenimiento

### Comandos PM2 Útiles

```bash
# Ver estado de la aplicación
pm2 status

# Ver logs en tiempo real
pm2 logs bluelobsters

# Reiniciar aplicación
pm2 restart bluelobsters

# Detener aplicación
pm2 stop bluelobsters

# Monitor en tiempo real
pm2 monit

# Ver información detallada
pm2 show bluelobsters
```

### Configurar Backups Automáticos

```bash
# Hacer script ejecutable
chmod +x backup.sh

# Configurar cron para backup diario a las 2 AM
crontab -e
# Agregar: 0 2 * * * /var/www/bluelobsters.io/backup.sh
```

### Logs de Sistema

```bash
# Logs de Nginx
sudo tail -f /var/log/nginx/bluelobsters.io.access.log
sudo tail -f /var/log/nginx/bluelobsters.io.error.log

# Logs de la aplicación (PM2)
pm2 logs bluelobsters --lines 100
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error "Cannot connect to database"
```bash
# Verificar permisos de base de datos
ls -la database/
sudo chown bluelobsters:bluelobsters database/users.db
```

#### 2. Error "Port 3000 already in use"
```bash
# Encontrar proceso usando el puerto
sudo lsof -i :3000
# Matar proceso si es necesario
sudo kill -9 <PID>
```

#### 3. Error de CORS en producción
```bash
# Verificar configuración de CORS en server.js
# Asegurar que bluelobsters.io está en allowedOrigins
```

#### 4. SSL/HTTPS no funciona
```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificado si es necesario
sudo certbot renew
```

### Verificar Estado del Sistema

```bash
# Estado de Nginx
sudo systemctl status nginx

# Estado de la aplicación
pm2 status

# Verificar conectividad
curl -I https://bluelobsters.io/api/health

# Verificar certificado SSL
openssl s_client -connect bluelobsters.io:443
```

## 📈 Optimizaciones de Rendimiento

### 1. Configurar Rate Limiting

Agregar al servidor Express (server.js):
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```

### 2. Configurar Compresión

```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Optimizar Base de Datos

```bash
# Hacer backup antes de optimizar
./backup.sh

# Opcional: migrar a PostgreSQL para mejor rendimiento
```

## 🔄 Actualizaciones

### Proceso de Actualización

```bash
# 1. Hacer backup
./backup.sh

# 2. Detener aplicación
pm2 stop bluelobsters

# 3. Actualizar código (si usas git)
git pull origin main

# 4. Instalar nuevas dependencias
npm ci --only=production

# 5. Reiniciar aplicación
pm2 start bluelobsters

# 6. Verificar que funciona
curl https://bluelobsters.io/api/health
```

## 📞 Soporte

### Información de Contacto
- Logs de aplicación: `pm2 logs bluelobsters`
- Logs de sistema: `/var/log/nginx/`
- Base de datos: `./database/users.db`
- Backups: `./backups/`

### Recursos Útiles
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

✅ **¡Felicidades!** Tu sistema de autenticación BlueLobsters está ahora en producción y listo para recibir usuarios reales.