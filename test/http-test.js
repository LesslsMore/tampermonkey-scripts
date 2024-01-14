const https = require('https');
const fs = require('fs');

// let url = 'https://www.dmla4.com/play/7069-1-1.html';
url = 'https://danmu.yhdmjx.com/m3u8.php?url=MbBZ4zrWeV4wo42UutQOazpsV%2FRiHXrdCSX8m9wykuAPlGrwCSUSkZ2Wbx9%2FC%2F3K6vGsl5hHocKAuKyM9%2FWu2A%3D%3D'
const filename = 'm3u8.html'

// console.log(filename)

https.get(url, (response) => {
  const file = fs.createWriteStream(filename);
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`File saved as ${filename}`);
  });
}).on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

// (""url":"[^"]+","url_next"")
