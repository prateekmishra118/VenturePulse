# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
# --ignore-scripts: skip the postinstall `prisma generate` here — it needs
# a real DATABASE_URL, which isn't available at image-build time. It's
# generated explicitly below once the schema is in place.
RUN npm ci --ignore-scripts

COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Production stage ----
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev --ignore-scripts
RUN npx prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/server.js"]
