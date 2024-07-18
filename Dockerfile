FROM ghcr.io/puppeteer/puppeteer:22.13.0 

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true \
    PUPPETEER_EXECUTABLE=PATH=/usr/bin/google-chrome-stable

WORKDIR /ust/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD ["nodemon", "app.js"]