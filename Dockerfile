FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuracion
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el codigo fuente
COPY . .

# Exponer puerto
EXPOSE 3001

# Comando para iniciar la aplicacion
CMD ["node", "index.js"]
