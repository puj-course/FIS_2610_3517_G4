FROM node:20-alpine AS backend-deps

WORKDIR /app/backend

# Instala solo dependencias de producción para reducir tamaño final.
COPY backend/package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine

WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY backend/ ./

EXPOSE 5000

# El backend arranca directamente con Node y toma variables del entorno del contenedor.
CMD ["node", "server.js"]
