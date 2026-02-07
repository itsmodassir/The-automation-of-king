FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace services/api
CMD ["npm", "run", "start:prod", "--workspace", "services/api"]
