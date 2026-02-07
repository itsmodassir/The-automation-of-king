FROM node:20-alpine
# build-stamp: 2026-02-07-23-22
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace services/app-frontend
CMD ["npm", "run", "start", "--workspace", "services/app-frontend"]
