# 🐧 NuevoGym - Instrucciones para Ubuntu/Linux

## 📋 **REQUISITOS PREVIOS**

1. **Ubuntu 20.04 o superior** (también funciona en Debian, Linux Mint, etc.)
2. **Node.js LTS** (versión 18 o superior)
3. **Git** (para clonar el repositorio)

---

## 🔧 **INSTALACIÓN EN UBUNTU**

### **Opción 1: Instalación Automática (Recomendada)**

```bash
# 1. Clonar el repositorio
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

# 2. Dar permisos de ejecución
chmod +x instalar-ubuntu.sh

# 3. Ejecutar instalador
./instalar-ubuntu.sh
```

### **Opción 2: Instalación Simple**

```bash
# 1. Clonar el repositorio
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

# 2. Ejecutar instalador simple
chmod +x instalar-ubuntu-simple.sh
./instalar-ubuntu-simple.sh
```

### **Opción 3: Instalación Manual**

```bash
# 1. Instalar Node.js (si no lo tienes)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clonar el repositorio
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

# 3. Instalar dependencias
npm install --legacy-peer-deps

# 4. Construir frontend
npm run build
```

---

## ▶️ **CÓMO USAR**

### **Opción 1: Con el script (Recomendada)**
```bash
./iniciar.sh
```

### **Opción 2: Manual**
```bash
node server.js
```

Luego abre tu navegador en: **http://localhost:4000**

---

## 🔐 **CREDENCIALES INICIALES**

- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 📁 **ESTRUCTURA DEL PROYECTO**

```
nuevogym/
├── server.js                    ← Servidor Express (backend)
├── package.json                 ← Dependencias del proyecto
├── vite.config.js               ← Configuración de Vite
├── instalar-ubuntu.sh           ← Instalador automático
├── instalar-ubuntu-simple.sh    ← Instalador simple
├── iniciar.sh                   ← Iniciador rápido (se crea)
├── src/                         ← Código fuente React (frontend)
├── public/                      ← Archivos públicos
└── dist/                        ← Frontend compilado (se genera)
```

---

## ⚠️ **SOLUCIÓN DE PROBLEMAS**

### **Error: "Node.js no está instalado"**
```bash
# Instalar Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

### **Error: "Permission denied"**
```bash
# Dar permisos de ejecución a los scripts
chmod +x instalar-ubuntu.sh
chmod +x instalar-ubuntu-simple.sh
chmod +x iniciar.sh
```

### **Error: "Puerto 4000 ya está en uso"**
```bash
# Ver qué proceso está usando el puerto
sudo lsof -i :4000

# Matar el proceso (reemplaza PID con el número que aparece)
kill -9 PID

# O cambiar el puerto en server.js (línea 8)
```

### **Error al instalar dependencias**
```bash
# Instalar con sudo si hay problemas de permisos
sudo npm install --legacy-peer-deps

# O configurar npm para no usar sudo
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### **Error: "Cannot find module"**
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 🔄 **ACTUALIZAR EL PROYECTO**

```bash
# Detener el servidor (Ctrl+C)

# Actualizar código
git pull origin main

# Reinstalar dependencias
npm install --legacy-peer-deps

# Reconstruir frontend
npm run build

# Reiniciar
./iniciar.sh
```

---

## 🚀 **EJECUTAR AL INICIO DEL SISTEMA**

### **Opción 1: Crear servicio systemd**

```bash
# 1. Crear archivo de servicio
sudo nano /etc/systemd/system/nuevogym.service

# 2. Pegar este contenido (ajusta las rutas):
[Unit]
Description=NuevoGym Sistema de Gestión
After=network.target

[Service]
Type=simple
User=tu_usuario
WorkingDirectory=/ruta/completa/a/nuevogym
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target

# 3. Guardar (Ctrl+X, Y, Enter)

# 4. Habilitar y iniciar servicio
sudo systemctl enable nuevogym
sudo systemctl start nuevogym

# 5. Ver estado
sudo systemctl status nuevogym

# 6. Ver logs
sudo journalctl -u nuevogym -f
```

### **Opción 2: Usar crontab**

```bash
# Editar crontab
crontab -e

# Agregar esta línea (ajusta la ruta):
@reboot cd /ruta/completa/a/nuevogym && node server.js >> ~/nuevogym.log 2>&1
```

---

## 📞 **SOPORTE**

Si tienes problemas:
1. Revisa este archivo
2. Revisa `README.md` para más detalles
3. Verifica que Node.js esté instalado: `node --version`
4. Verifica permisos de los scripts: `ls -la *.sh`

---

## ✅ **VERIFICACIÓN RÁPIDA**

Después de instalar, verifica que existan estos archivos:
```bash
ls -la node_modules/  # Carpeta con dependencias
ls -la dist/          # Carpeta con frontend compilado
ls -la server.js      # Servidor backend
ls -la iniciar.sh     # Script de inicio
```

---

## 🎯 **INICIO RÁPIDO (RESUMEN)**

```bash
# 1. Clonar
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

# 2. Instalar
chmod +x instalar-ubuntu-simple.sh
./instalar-ubuntu-simple.sh

# 3. Usar
./iniciar.sh

# 4. Abrir navegador
# http://localhost:4000
```

---

## 🔒 **CONFIGURAR FIREWALL (Opcional)**

Si quieres acceder desde otros dispositivos en tu red:

```bash
# Permitir puerto 4000
sudo ufw allow 4000/tcp

# Ver tu IP local
ip addr show | grep inet

# Acceder desde otro dispositivo
# http://TU_IP_LOCAL:4000
```

---

## 💡 **CONSEJOS**

1. **Mantén Node.js actualizado:**
   ```bash
   sudo npm install -g n
   sudo n lts
   ```

2. **Usa PM2 para gestión avanzada:**
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name nuevogym
   pm2 startup
   pm2 save
   ```

3. **Habilita logs:**
   ```bash
   node server.js >> ~/nuevogym.log 2>&1
   ```

---

**¡Listo! 🎉**

Para cualquier problema, revisa los logs o contacta al soporte.

