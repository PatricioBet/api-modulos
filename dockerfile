# Usa la imagen oficial de Node.js
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de tu aplicación al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto en el que tu aplicación se ejecuta
EXPOSE 3004 

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
