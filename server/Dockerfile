FROM node:22-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY server/src ./src
COPY server/migrations ./migrations
COPY public/certificates ./certificate-assets
ENV NODE_ENV=production
ENV PORT=4500
USER node
EXPOSE 4500
CMD ["node", "src/server.mjs"]
