# ---- client/Dockerfile ----
# Multi-stage: build with Node, serve with nginx.

# ---- Stage 1: build the SPA ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Vite reads VITE_API_URL at build time; pass it with:
#   docker build --build-arg VITE_API_URL=https://api.tripwithuz.com .
# or leave blank to use same-origin (/api/*).
ARG VITE_API_URL=
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ---- Stage 2: nginx runtime ----
FROM nginx:1.27-alpine AS runtime

# Replace default nginx config with SPA-friendly one.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
