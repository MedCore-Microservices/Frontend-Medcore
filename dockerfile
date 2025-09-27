# Usa una imagen de Node.js
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala todas las dependencias
RUN npm ci

# Copia todo el código fuente
COPY . .

# Solo build de Next.js (NO prisma generate)
RUN npm run build

# EJECUTA EN FORMATO JSON CORRECTO:
CMD ["npm", "run", "dev"]