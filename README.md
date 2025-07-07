# BlueLobsters.io - Sistema de Autenticación

Sistema completo de autenticación para el sitio web BlueLobsters con backend Node.js y base de datos SQLite.

## 🚀 Características

- ✅ **Registro de usuarios** con validación completa
- ✅ **Login seguro** con JWT tokens  
- ✅ **Encriptación de contraseñas** usando bcrypt
- ✅ **Base de datos SQLite** para persistencia
- ✅ **API RESTful** para autenticación
- ✅ **Protección del Dojo** - solo usuarios autenticados
- ✅ **Logout funcional** desde el dojo
- ✅ **Responsive design** con popups elegantes

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- npm (incluido con Node.js)

## 🛠️ Instalación y Uso

### ⚠️ IMPORTANTE: DEBE usar el servidor local

El sistema de autenticación **NO funcionará** si abres los archivos HTML directamente. Debes usar el servidor local.

### 📋 Pasos correctos:

1. **Instalar dependencias:**
```bash
npm install
```

2. **Iniciar el servidor:**
```bash
npm start
```

3. **Acceder al sitio:**
```
http://localhost:3000
```

### 🚫 Lo que NO debes hacer:
- ❌ Abrir `index.html` directamente desde el explorador
- ❌ Usar protocolo `file://`
- ❌ Hacer doble clic en los archivos HTML

### ✅ Lo que SÍ debes hacer:
- ✅ Ejecutar `npm start` en terminal
- ✅ Ir a `http://localhost:3000` en el navegador
- ✅ Usar el servidor local siempre

### 🔧 Para desarrollo (con auto-reload):
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
bluelobsters.io/
├── server.js                 # Servidor principal Express
├── package.json              # Dependencias y scripts
├── .env                      # Variables de entorno
├── database/
│   ├── db.js                 # Módulo de base de datos
│   └── users.db              # Base de datos SQLite (se crea automáticamente)
├── js/
│   └── auth.js               # Cliente JavaScript para autenticación
├── index.html               # Página principal
├── blog.html                # Página de blog
├── dojo.html                # Página protegida del dojo
├── blog_post_001.html       # Artículo del blog
└── img/                     # Imágenes del sitio
```

## 🔐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token JWT
- `GET /api/auth/profile` - Obtener perfil del usuario

### Administración
- `GET /api/admin/users` - Listar todos los usuarios (requiere auth)

### Utilidades
- `GET /api/health` - Estado del servidor

## 💾 Base de Datos

Los usuarios se almacenan en una base de datos SQLite (`database/users.db`) con la siguiente estructura:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    active INTEGER DEFAULT 1
);
```

## 🔧 Configuración

Las variables de entorno se configuran en el archivo `.env`:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=bluelobster_super_secret_key_2024
DB_PATH=./database/users.db
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,file://
```

## 🎯 Cómo Funciona

### Flujo de Registro
1. Usuario completa formulario de registro
2. Frontend envía datos a `/api/auth/register`
3. Backend valida datos y encripta contraseña
4. Se crea usuario en base de datos
5. Se genera JWT token
6. Usuario es redirigido automáticamente al dojo

### Flujo de Login
1. Usuario ingresa email y contraseña
2. Frontend envía datos a `/api/auth/login`
3. Backend verifica credenciales
4. Se actualiza `last_login` en base de datos
5. Se genera JWT token
6. Usuario es redirigido al dojo

### Protección del Dojo
1. Al acceder a `/dojo`, se verifica el token JWT
2. Si el token es válido, se muestra el contenido
3. Si no hay token o es inválido, se redirige al inicio
4. El nombre del usuario se muestra en el header

## 🛡️ Seguridad

- **Contraseñas encriptadas** con bcrypt (12 rounds)
- **JWT tokens** con expiración de 7 días
- **Validación de entrada** en frontend y backend
- **Protección CORS** configurada
- **Headers de seguridad** implementados

## 🗂️ Gestión de Usuarios

### Ver usuarios registrados
```bash
# Acceder a la base de datos SQLite
sqlite3 database/users.db

# Consultar usuarios
SELECT id, name, email, created_at, last_login FROM users;
```

### API para administradores
Usa el endpoint `/api/admin/users` con un token válido para obtener la lista de usuarios.

## 🚨 Troubleshooting

### Error: Puerto en uso
```bash
# Verificar procesos en puerto 3000
lsof -i :3000

# Matar proceso si es necesario
kill -9 <PID>
```

### Error: Base de datos bloqueada
```bash
# Eliminar archivo de lock si existe
rm database/users.db-wal
rm database/users.db-shm
```

### Error: Permisos de archivo
```bash
# Dar permisos de escritura a la carpeta database
chmod 755 database/
chmod 644 database/users.db
```

## 📊 Logs y Monitoreo

El servidor muestra logs útiles:
- ✅ Conexión a base de datos
- ✅ Creación de tablas
- ✅ Registros y logins
- ✅ Errores de autenticación
- ✅ Estado del servidor

## 🔄 Actualizaciones Futuras

- [ ] Recuperación de contraseñas por email
- [ ] Autenticación de dos factores (2FA)
- [ ] Roles y permisos de usuario
- [ ] Dashboard de administración
- [ ] Integración con OAuth (Google, GitHub)
- [ ] Rate limiting para APIs
- [ ] Logs de auditoría avanzados

## 📞 Soporte

Para problemas o preguntas:
1. Revisa los logs del servidor en la consola
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que el puerto 3000 esté disponible
4. Revisa la configuración en el archivo `.env`

---

**BlueLobsters™** | Rare is a Feature