FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000 9229


CMD ["npm", "run", "start:dev"]

EXPOSE 5000

