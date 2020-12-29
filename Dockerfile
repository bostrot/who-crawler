FROM node:latest

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 && \
    apt-get install -y libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 && \
    apt-get install -y libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 && \
    apt-get install -y libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 && \
    apt-get install -y libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 && \
    apt-get install -y libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 && \
    apt-get install -y libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 && \
    apt-get install -y libnss3 lsb-release xdg-utils wget
