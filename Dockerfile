FROM node:14-alpine3.12
WORKDIR /usr/src/app
COPY package*.json yarn*.lock ./
RUN yarn && yarn global add nodemon
COPY backend src
EXPOSE 8080
ENTRYPOINT ["yarn"]