FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace services/app-frontend
CMD ["npm", "run", "start", "--workspace", "services/app-frontend"]
