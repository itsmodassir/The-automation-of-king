FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace @aerostic/common
RUN npm run build --workspace services/webhook-worker
CMD ["npm", "run", "start:prod", "--workspace", "services/webhook-worker"]
