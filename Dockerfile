FROM node:16

WORKDIR /usr/app

COPY . .

RUN npm i

EXPOSE 3000

CMD [ "npm", "start"]