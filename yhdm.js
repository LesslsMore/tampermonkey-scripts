// https://agsec.org/archives/205

var request = require('sync-request');
const CryptoJS = require('crypto-js'); 

// let url = 'https://www.dmla4.com/play/7069-1-1.html';
let url = 'https://www.dmla4.com/play/8528-1-1.html'

const key = CryptoJS.enc.Utf8.parse("57A891D97E332A9D");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('844182a9dfe9c5ca');   //十六位十六进制数作为密钥偏移量

let body = get_src_url(url)

let m3u8 = get_m3u8_url(body)

if (m3u8) {
    let body = get_src_url(m3u8)
    let aes_data = get_encode_url(body)
    if (aes_data) {

        let url = Decrypt(aes_data)
        // console.log(url)
        let src = url.split('.net/')[1]
        console.log(`http://v16m-default.akamaized.net/${src}`)
    }
}

//解密方法
function Decrypt(srcs) {
    // let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

//加密方法
function Encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}

// export default {
//     Decrypt ,
//     Encrypt
// }

// console.log(body);

function get_m3u8_url(data) {
    let regex = /"url":"([^"]+)","url_next":"([^"]+)"/g;

    const matches = data.match(regex);
  
    if (matches) {
      let play = JSON.parse(`{${matches[0]}}`)
    //   console.log(play.url)
  
      let m3u8 = `https://danmu.yhdmjx.com/m3u8.php?url=${play.url}`
      console.log(m3u8)
      return m3u8
      // const firstMatch = matches[0];
      // const secondMatch = matches[1];
      // console.log(`First match: ${firstMatch}`);
      // console.log(`Second match: ${secondMatch}`);
    } else {
      console.log('No matches found.');
    }
}

function get_encode_url(data) {
    regex = /getVideoInfo\("([^"]+)"/;
    
    const matches = data.match(regex);
  
    if (matches) {
        return matches[1]

      // const firstMatch = matches[0];
      // const secondMatch = matches[1];
      // console.log(`First match: ${firstMatch}`);
      // console.log(`Second match: ${secondMatch}`);
    } else {
      console.log('No matches found.');
    }
}

function get_src_url(url) {
    var res = request('GET', url);
    return res.getBody('utf8');
}





