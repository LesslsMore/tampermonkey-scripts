const fs = require('fs');

let html = '7069-1-1.html' 
// html = 'm3u8.html'

fs.readFile(html, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let regex = /"url":"([^"]+)","url_next":"([^"]+)"/g;

  const matches = data.match(regex);

  if (matches) {
    let play = JSON.parse(`{${matches[0]}}`)
    console.log(play.url)

    let m3u8 = `https://danmu.yhdmjx.com/m3u8.php?url=${play.url}`
    console.log(m3u8)
    // const firstMatch = matches[0];
    // const secondMatch = matches[1];
    // console.log(`First match: ${firstMatch}`);
    // console.log(`Second match: ${secondMatch}`);
  } else {
    console.log('No matches found.');
  }
});




