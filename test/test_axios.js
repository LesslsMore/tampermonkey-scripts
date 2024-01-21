const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://www.dmla4.com/play/7069-1-1.html',
  headers: { }
};

// await axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// });
let url = 'https://www.dmla4.com/play/7069-1-1.html'
getUser(url)

async function getUser(url) {
    try {
      const response = await axios.get(url);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
