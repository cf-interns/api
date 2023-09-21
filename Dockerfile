FROM node:18

WORKDIR /user/src/app

COPY . .

RUN npm ci --force 

RUN npm run build

USER node

CMD [ "npm", "run", "start:prod" ]

EXPOSE 5000