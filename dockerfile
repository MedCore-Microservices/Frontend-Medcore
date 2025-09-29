# Dockerfile.dev (o simplemente Dockerfile si solo usas Docker para desarrollo)
FROM node:20-alpine

WORKDIR /app

# Copia package.json primero
COPY package*.json ./

# Instala dependencias
RUN npm ci

EXPOSE 3000

# El código se montará desde el host vía volumen
CMD ["npm", "run", "dev"]