# Etapa 1: Construcción
FROM node:20.14.0-alpine AS builder

WORKDIR /app

# Actualizar paquetes del sistema
RUN apk update && apk upgrade --no-cache

# Copiar package.json y lockfile
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Si falla, quitar "--turbopack" de la línea de build.
RUN npm run build

# Etapa 2: Producción (usamos distroless para máxima seguridad y mínimo tamaño)
FROM gcr.io/distroless/nodejs20-debian12 AS runner

WORKDIR /app

# Copiar lo necesario para ejecutar la app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Puerto que usa Next.js por defecto
EXPOSE 3000

# Comando para iniciar la app
CMD ["node_modules/.bin/next", "start"]