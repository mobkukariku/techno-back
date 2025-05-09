FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY src/prisma ./src/prisma
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
