#Use the specified Puppeteer image as the base image
FROM ghcr.io/puppeteer/puppeteer:22.13.0 

#Skip chromium download as set the executable path for puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

#Set the working directory
WORKDIR /ust/src/app

#Copy package.json and package-lock.json to the working directory
COPY package*.json ./

#install dependencies using npm
RUN npm ci

#copy the rest of the application code to the working directory
COPY . .

#Command to run the application
CMD ["node", "app.js"]