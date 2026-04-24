# ---- server/Dockerfile ----
# Minimal production image for the Trip with uz Express API.
FROM node:20-alpine AS runtime

# Create app directory owned by a non-root user.
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app

# Install production deps only. Copy lockfile first so layer caches well.
COPY --chown=app:app package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the rest of the server source.
COPY --chown=app:app . .

# `db/` is a mounted volume — declare it so container deletion doesn't wipe data.
# If you don't mount a volume, data still persists *inside* the container but is
# lost on `docker rm`.
VOLUME ["/app/db"]

USER app
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Health check — Docker/Kubernetes can use this for liveness.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
