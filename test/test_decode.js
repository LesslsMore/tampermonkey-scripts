
const CryptoJS = require('crypto-js'); 

const key = CryptoJS.enc.Utf8.parse("57A891D97E332A9D");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('844182a9dfe9c5ca');   //十六位十六进制数作为密钥偏移量

let aes_data = "XmTE2MJB0GifUP4WEsdwFAyp2DTuCEBxA2Ji5Qf8Q8oRTw3QWzQTZM17B6KJMWL1Xd0pKZYaQJOcEvLNoKIRLiEOaINN4UfzaeYK/flXWgeVzp15Ub9MgfwXSXoDqV35Xy0+hHY1mKwYXOXHMTuVQ7m38Nk+tE6xdmxBgfNKP6ZzJ2sJM8qiNj6dUtNuqnx55qhACKUD+mZn+I47OJd9I2S/SwqHvz3plzwHTtrrSKrzPf1rAaY/roJdIKWRfIxEjub1kIny3BlS47qEOanQB267jg6wtRea9SJeP57rbwq55e4d1pC8GmL4d8HaZUtwC7eNthxGAbqNN8rmUMr4PFNpqksvjGr5zDBAZr2CnNsCcd5mPrKz63OG3kneuGEVX3ESnqM83Lg8xYeRqX8XLBZkS6F32OlnO+JtVEOz1F7+gRQ/ZfdzH0+wFXDbCO24vcXxCgo42dKdU/GBsP2FSiIibK3P8U6ETIAGU+95QJE2JO57SfeT9hSvw/JUGiXXRG2FfLiVRg9ocNDZcUCHOpDqpBplVpwil3yvr40jz9LXjDxRF9KhQCwgRtmiPqacAPRuOoKG3BtSKA49bdj8zmAhLGFyWJ3ChOJRiFtl+wE="
let url = Decrypt(aes_data)
// console.log(url)
let src = url.split('.net/')[1]
console.log(`http://v16m-default.akamaized.net/${src}`)

//解密方法
function Decrypt(srcs) {
    // let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}