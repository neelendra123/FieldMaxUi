FROM node:14.16.0

LABEL authors="Rohit Dalal<rohit@dev-story.com>"

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript ts-node serve

RUN npm ci

COPY . .

# RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]