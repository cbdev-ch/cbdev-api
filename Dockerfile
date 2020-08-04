FROM node:12.18.3-buster
MAINTAINER CBDEV
WORKDIR /app
RUN apt-get update && apt-get install -y \
    graphicsmagick \
    ghostscript
ADD package.json /app/package.json
RUN npm install
ADD . /app
CMD ["npm", "run", "start"]
EXPOSE 3000