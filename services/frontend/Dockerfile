FROM node:20-alpine
# build-stamp: 2026-02-07-23-22
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build --workspace @aerostic/frontend
CMD ["npm", "run", "start", "--workspace", "@aerostic/frontend"]
