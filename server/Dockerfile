FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY shared ./shared
COPY server ./server

# Install root dependencies
RUN npm install

# Install server dependencies
WORKDIR /app/server
RUN npm install

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000
