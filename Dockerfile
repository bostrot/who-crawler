FROM debian:10.7

RUN apt-get update -y && \
    apt-get upgrade -y

# Dependencies
RUN apt-get install -y ca-certificates fonts-liberation libappindicator3-1 \
    libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 \
    libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 \
    libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
    libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    lsb-release wget xdg-utils gnupg2 

# Chromium
RUN wget -qO - "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xea6e302dc78cc4b087cfc3570ebea9b02842f111" | apt-key   add - && \
    echo "deb http://ppa.launchpad.net/chromium-team/beta/ubuntu bionic main" > "/etc/apt/sources.list.d/chromium.list" && \
    apt-get update && \
    apt-get install -y chromium-browser

# NodeJS 15
RUN wget https://deb.nodesource.com/setup_15.x && \
    /bin/bash setup_15.x && \
    apt-get install -y nodejs

COPY . /builds/botty-group/who-crawler/
RUN cd /builds/botty-group/who-crawler/ && \
    npm install