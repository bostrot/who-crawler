const fetch = require('node-fetch');
const jsdom = require('jsdom');
const {
  JSDOM,
} = jsdom;
const puppeteer = require('puppeteer');
const GhostAdminAPI = require('@tryghost/admin-api');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const url = process.argv[2];
const key = process.argv[3];

const api = new GhostAdminAPI({
  url,
  version: 'v3',
  key,
});

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--incognito',
      '--single-process',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  } );
  const page = await browser.newPage();
  const VIEWPORT = {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
  };
  await page.setViewport(VIEWPORT);
  await page.goto('https://experience.arcgis.com/experience/' +
  '685d0ace521648f8a5beeeee1b9125cd', {
    waitUntil: ['load', 'networkidle0', 'networkidle2'],
  });

  await page.screenshot({
    path: 'map.png',
    fullPage: 'true',
  });

  await browser.close();

  const imageUpload = api.images.upload({
    ref: 'Corona_Map',
    file: 'map.png',
  });

  Promise
      .resolve(imageUpload)
      .then((image) => {
        const clean = function(text) {
          return text.replace(/  /g, '').replace(/\n/g, '');
        };
        // fetch faq
        fetch('https://www.who.int/news-room/q-a-detail/q-a-coronaviruses')
            .then((res) => res.text())
            .then((body) => {
              const dom = new JSDOM(body);
              const doc = dom.window.document;
              const faqTopics = [];
              const faqContent = [];
              let faq = '';
              for (let i = 0; i < doc.querySelectorAll(
                  '.sf-accordion__link').length; i++) {
                faqTopics[i] = clean(doc.querySelectorAll(
                    '.sf-accordion__link')[i].textContent);
                faqContent[i] = clean(doc.querySelectorAll(
                    '.sf-accordion__content')[i].textContent);
                faq += '<h3>' + faqTopics[i] + '</h3><p>' + faqContent[i] +
                '</p>';
              }
              // latest situation report
              fetch('https://www.who.int/emergencies/diseases/' +
              'novel-coronavirus-2019/situation-reports/')
                  .then((res) => res.text())
                  .then((body) => {
                    const dom = new JSDOM(body);
                    const doc = dom.window.document;
                    const selector0 = 'div > div > p > a';
                    const selector1 = 'div > div > p > a > strong';
                    const link = 'https://www.who.int' + clean(doc.
                        querySelector(selector0).getAttribute('href'));
                    const linkName = clean(doc.querySelector(selector1).
                        textContent);
                    const latestReport = '<a href="' + link + '">' + linkName +
                     '</a>';
                    console.log(linkName);
                    // latest situation report
                    fetch('https://www.who.int/emergencies/diseases/novel-' +
                    'coronavirus-2019/events-as-they-happen')
                        .then((res) => res.text())
                        .then((body) => {
                          const dom = new JSDOM(body);
                          const doc = dom.window.document;
                          const latestNews = doc.querySelector('.col-md-8 > '+
                          '.sf-content-block.content-block > div').textContent;
                          const date = new Date(); a;
                          const content = `
              <p>
              This is a corona live feed that is updated every 15 minutes with
              a web crawler from the official WHO website with the latest news 
              and information. 
              </p>
              <h2>Latest Update</h2>
              ${latestNews}
              <h2>Current Spread Map</h2>
              <img src="${image.url}"></img>
              <h2>Current FAQ</h2>
              ${faq}
              <h2>Latest Report</h2>
              ${latestReport}
              <h2>Sources</h2>
              https://experience.arcgis.com/experience/685d0ace521648f8a5beeeee1b9125cd
               - Q&A Coronavirus (last crawled ${date})
              https://www.who.int/news-room/q-a-detail/q-a-coronaviruses
               - Q&A Coronavirus (last crawled ${date})
              https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports/
               - Situation repots (last crawled ${date})
              https://www.who.int/emergencies/diseases/novel-coronavirus-2019/events-as-they-happen
               - Events as they happen (last crawled ${date})
              `;
                          api.posts.browse({
                            filter: 'tag:corona',
                          })
                              .then((posts) => {
                                posts.forEach((post) => {
                                  console.log(post.title);
                                  api.posts.edit({
                                    id: post.id,
                                    updated_at: post.updated_at,
                                    html: content,
                                  }, {
                                    source: 'html',
                                  })
                                      .catch((err) => console.log(err));
                                });
                              })
                              .catch((err) => {
                                console.error(err);
                              });
                        });
                  });
            });
      });
})();
