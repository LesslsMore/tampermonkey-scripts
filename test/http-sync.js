const https = require('https');

const url = 'https://www.dmla4.com/play/7069-1-1.html';

try {
  const response = https.request(url);
  console.log(response)
  const body = response.body;
  console.log(body);
} catch (error) {
  console.error(`Error: ${error.message}`);
}
