FROM node:22-alpine AS deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app/backend
COPY --from=deps /app/backend/node_modules ./node_modules
COPY backend/package.json backend/package-lock.json backend/tsconfig.json backend/vitest.config.ts ./
COPY backend/scripts ./scripts
COPY backend/src ./src
COPY microservice/contracts /app/microservice/contracts
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app/backend
ENV NODE_ENV=production
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/backend/dist ./dist
EXPOSE 4000
CMD ["npm", "run", "start"]
