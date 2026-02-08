FROM node:20-alpine
# build-stamp: 2026-02-07-23-22
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm rebuild bcrypt --build-from-source
RUN npm run build --workspace @aerostic/api
CMD ["npm", "run", "start:prod", "--workspace", "@aerostic/api"]
