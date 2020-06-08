FROM node:current-alpine
WORKDIR /app
ADD package.json /app/package.json
RUN npm install
ADD . /app
RUN ["npm", "run", "start"]
EXPOSE 3000