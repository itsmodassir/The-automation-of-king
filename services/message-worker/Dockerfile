FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace @aerostic/common
RUN npm run build --workspace services/message-worker
CMD ["npm", "run", "start:prod", "--workspace", "services/message-worker"]
