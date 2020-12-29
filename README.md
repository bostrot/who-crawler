# who-crawler for Ghost CMS

This is a little crawler using puppeteer which keeps a post on the CMS Ghost up-to-date with latest information from the WHO regarding COVID-19.

Build image: `docker build -t bostrot/who-crawler-dependencies .`

Runs with `node index.js $GHOST_URL $GHOST_API_KEY $IMGUR_API_KEY`

