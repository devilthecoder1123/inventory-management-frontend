# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# API base URL is baked in at build time (Vite). Defaults to the nginx proxy path.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ---------- Runtime stage (nginx) ----------
FROM nginx:1.27-alpine AS runner

# SPA + API proxy config.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
