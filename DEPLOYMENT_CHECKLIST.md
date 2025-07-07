# ✅ Checklist de Deployment - BlueLobsters.io

## 🎯 Pre-Deployment

### Servidor
- [ ] Servidor con Ubuntu 20.04+ configurado
- [ ] Acceso SSH funcionando
- [ ] Dominio bluelobsters.io apuntando al servidor
- [ ] Node.js v16+ instalado
- [ ] npm actualizado
- [ ] PM2 instalado globalmente
- [ ] Nginx instalado (opcional)

### Archivos del Proyecto
- [ ] Todos los archivos subidos al servidor
- [ ] Permisos de archivos configurados
- [ ] `.env.production` creado con valores seguros
- [ ] JWT_SECRET cambiado por algo seguro
- [ ] Base de datos preparada

## 🚀 Deployment

### Instalación
- [ ] `npm ci --only=production` ejecutado
- [ ] `./deploy.sh` ejecutado exitosamente
- [ ] PM2 iniciado y funcionando
- [ ] Aplicación respondiendo en puerto 3000

### Nginx (si se usa)
- [ ] Configuración de nginx copiada
- [ ] Virtual host activado
- [ ] `nginx -t` sin errores
- [ ] Nginx reiniciado

### SSL/HTTPS
- [ ] Certificado SSL obtenido
- [ ] HTTPS funcionando
- [ ] Redirección HTTP→HTTPS configurada
- [ ] Certificado válido y sin errores

## 🔐 Seguridad

### Variables de Entorno
- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` cambiado y seguro (32+ caracteres)
- [ ] CORS configurado para bluelobsters.io únicamente
- [ ] Credenciales de producción configuradas

### Firewall
- [ ] UFW habilitado
- [ ] Puerto 22 (SSH) abierto
- [ ] Puerto 80 (HTTP) abierto
- [ ] Puerto 443 (HTTPS) abierto
- [ ] Puerto 3000 cerrado externamente
- [ ] Otros puertos innecesarios cerrados

### Permisos
- [ ] Usuario `bluelobsters` creado
- [ ] Archivos propiedad del usuario correcto
- [ ] Base de datos con permisos adecuados
- [ ] Scripts ejecutables

## 🧪 Testing Post-Deployment

### Conectividad Básica
- [ ] `https://bluelobsters.io` carga correctamente
- [ ] `https://bluelobsters.io/api/health` responde OK
- [ ] CSS y JavaScript cargan sin errores
- [ ] No hay errores 404 en recursos

### Funcionalidad de Autenticación
- [ ] Popup de registro aparece al hacer clic en "Dojo"
- [ ] Registro de nuevo usuario funciona
- [ ] Login con usuario existente funciona
- [ ] Token JWT se genera correctamente
- [ ] Acceso al dojo funciona después del login
- [ ] Logout funciona correctamente
- [ ] Redirección al intentar acceder sin login

### Seguridad
- [ ] HTTPS forzado (HTTP redirige a HTTPS)
- [ ] Headers de seguridad presentes
- [ ] No hay información sensible en logs públicos
- [ ] CORS bloqueando orígenes no autorizados

## 📊 Monitoreo

### PM2
- [ ] `pm2 status` muestra app corriendo
- [ ] `pm2 logs` sin errores críticos
- [ ] `pm2 monit` funcionando
- [ ] Restart automático configurado

### Logs
- [ ] Logs de aplicación funcionando
- [ ] Logs de Nginx funcionando (si aplica)
- [ ] Rotación de logs configurada
- [ ] No hay errores en logs de sistema

### Base de Datos
- [ ] Base de datos creada correctamente
- [ ] Tabla `users` existe
- [ ] Permisos de escritura funcionando
- [ ] Backup inicial creado

## 🔄 Backup y Mantenimiento

### Backups
- [ ] Script de backup funcionando
- [ ] Backup manual ejecutado exitosamente
- [ ] Cron job configurado para backups automáticos
- [ ] Directorio de backups creado

### Monitoreo Continuo
- [ ] Health check endpoint funcionando
- [ ] PM2 health monitoring configurado
- [ ] Logs accesibles para debugging
- [ ] Plan de mantenimiento definido

## 🌐 DNS y Dominio

### Configuración DNS
- [ ] Registro A para bluelobsters.io
- [ ] Registro A para www.bluelobsters.io
- [ ] TTL configurado apropiadamente
- [ ] Propagación DNS completada

### Certificado SSL
- [ ] Certificado válido para ambos dominios
- [ ] Certificado no expira pronto
- [ ] Renovación automática configurada (Let's Encrypt)
- [ ] Chain completo configurado

## 📱 Testing de Usuario Final

### Navegadores
- [ ] Chrome/Chromium funciona
- [ ] Firefox funciona  
- [ ] Safari funciona
- [ ] Edge funciona

### Dispositivos
- [ ] Desktop funciona
- [ ] Mobile funciona
- [ ] Tablet funciona

### Flujo Completo
- [ ] Usuario puede registrarse
- [ ] Usuario puede hacer login
- [ ] Usuario puede acceder al dojo
- [ ] Usuario puede hacer logout
- [ ] Usuario no puede acceder sin autenticación

## 🚨 Plan de Rollback

### Preparación
- [ ] Backup de versión anterior disponible
- [ ] Procedimiento de rollback documentado
- [ ] Acceso de emergencia configurado
- [ ] Contactos de soporte definidos

## ✅ Sign-off Final

### Responsables
- [ ] **Desarrollador**: Funcionalidad técnica verificada
- [ ] **DevOps**: Infraestructura y seguridad verificada  
- [ ] **QA**: Testing de usuario completado
- [ ] **Producto**: Experiencia de usuario aprobada

### Fecha de Deployment
- **Fecha**: _______________
- **Hora**: _______________
- **Responsable**: _______________
- **Estado**: ✅ COMPLETADO / ❌ PENDIENTE

---

## 📞 Contactos de Emergencia

- **Servidor**: [Proveedor de hosting]
- **DNS**: [Proveedor de dominio]  
- **SSL**: [Proveedor de certificado]
- **Desarrollador**: [Contacto técnico]

---

**Nota**: Este checklist debe completarse antes de considerar el deployment como exitoso. Cualquier ítem marcado como ❌ debe resolverse antes del go-live.