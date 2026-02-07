FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application (if there's a build script)
RUN npm run build 2>/dev/null || echo 'No build script found'

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
