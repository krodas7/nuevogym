# Usar imagen base de Ubuntu con Node.js
FROM ubuntu:22.04

# Evitar prompts interactivos
ENV DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    python3 \
    python3-pip \
    wine \
    wine32 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Instalar Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos del proyecto
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Recompilar módulos nativos para Electron
RUN npm run rebuild

# Construir frontend
RUN npm run build

# Configurar Wine
RUN winecfg

# Exponer puertos
EXPOSE 4000 9000

# Crear script de inicio
RUN echo '#!/bin/bash\n\
echo "🚀 Iniciando NuevoGym en Docker..."\n\
echo "📦 Instalando dependencias..."\n\
npm install --legacy-peer-deps\n\
echo "🔧 Recompilando módulos..."\n\
npm run rebuild\n\
echo "🌐 Iniciando aplicación..."\n\
npm start\n\
' > /app/start.sh && chmod +x /app/start.sh

# Comando por defecto
CMD ["/app/start.sh"]
