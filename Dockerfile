FROM node:16-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./ 
RUN yarn && yarn global add nodemon
EXPOSE 8080
ENTRYPOINT ["yarn"]
