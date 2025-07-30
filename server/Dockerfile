FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm run dev"]
