# Usamos una imagen de Node.js para desarrollo
FROM node:22

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json (o yarn.lock) para instalar dependencias
COPY package*.json ./

# Instalar todas las dependencias, incluyendo las de desarrollo
RUN npm install

# Copiar todo el código fuente al contenedor
COPY . .

# Exponer el puerto en el que la app escuchará
EXPOSE 4000

# Habilitar el modo de desarrollo con ts-node
CMD ["npm", "run", "dev"]
