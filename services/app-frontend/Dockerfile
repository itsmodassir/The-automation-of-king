FROM node:20-alpine
# build-stamp: 2026-02-07-23-22
WORKDIR /app
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm install --legacy-peer-deps
RUN npm run build --workspace @aerostic/app-frontend
CMD ["npm", "run", "start", "--workspace", "@aerostic/app-frontend"]
