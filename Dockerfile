FROM node:12.18.3-buster
LABEL maintainer="info@cbdev.ch"
WORKDIR /app
RUN apt-get update && apt-get install -y \
    imagemagick \
    ghostscript \
    poppler-utils
ADD package.json /app/package.json
RUN npm install
ADD . /app
CMD ["npm", "run", "start"]
EXPOSE 3000