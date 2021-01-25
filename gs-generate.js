const langs = ['en', 'es'];
const http = require('https');
const cheerio = require('cheerio');
const fs = require('fs');
const HOST = 'https://www.myabakus.com';

for (const lang of langs) {
    http.get(`${HOST}/js/gs-${lang}.js`, res => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          console.log(rawData);
          rawData = rawData.replace('var data = ', '').replace(';', '');
          const { videos } = JSON.parse(rawData);
          const content = require('fs').readFileSync('./gs-template-' + lang + '.html', 'utf8');
          const doc = cheerio.load(content, { decodeEntities: false })
          let i = 0;
          for (const video of videos) {
            doc('title').html(video.title);
            doc('h2').html(video.title);
            doc('a').attr('href', `${HOST}/videos/` + slug(video.title));
            fs.writeFileSync('./gs/' + lang + '-' + id(i) + '.html', doc.html());
            i ++;
          }
        } catch (e) {
          console.error(e.message);
        }
      });
    });
}

function id(i) {
  return i.toString().length == 1 ? '0' + i : i;
}


function slug(value) {
  return value
    .toString()
    .toLowerCase()
    .replace(/á/gi, 'a')
    .replace(/é/gi, 'e')
    .replace(/í/gi, 'i')
    .replace(/ó/gi, 'o')
    .replace(/ú/gi, 'u')
    .replace(/ñ/gi, 'n')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}
