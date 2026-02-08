FROM node:20-alpine
# build-stamp: 2026-02-09-Phase1-Fix
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build --workspace @aerostic/message-worker
CMD ["npm", "run", "start:prod", "--workspace", "@aerostic/message-worker"]
