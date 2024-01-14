const fs = require('fs');

get_url()

function get_url() {
    let html = 'm3u8.html'
    
    fs.readFile(html, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
    
      regex = /getVideoInfo\("([^"]+)"/;
    
      const matches = data.match(regex);
    
      if (matches) {
        console.log(matches[1])
    

        // const firstMatch = matches[0];
        // const secondMatch = matches[1];
        // console.log(`First match: ${firstMatch}`);
        // console.log(`Second match: ${secondMatch}`);
      } else {
        console.log('No matches found.');
      }
    });
}