const CryptoJS = require('crypto-js'); 

// function AesEncrypt(encodeStr, key) {
//     const encodeBytes = new TextEncoder().encode(encodeStr);
//     const block = new aesjs.ModeOfOperation.cbc(key, iv);
//     const blockSize = block._cipher._blockSize;
//     const paddedBytes = aesjs.padding.pkcs7.pad(encodeBytes, blockSize);
//     const cryptedBytes = block.encrypt(paddedBytes);
//     return aesjs.utils.hex.fromBytes(cryptedBytes);
// }

function AesEncrypt(encodeStr, key) {
    const encodeBytes = new TextEncoder().encode(encodeStr);
    const block = CryptoJS.AES.Algorithm._createHelper(CryptoJS.algo.AES).createEncryptor(key, { iv: iv });
    const blockSize = block._cipher._blockSize;
    const paddedBytes = CryptoJS.pad.Pkcs7.pad(encodeBytes, blockSize);
    const cryptedBytes = block.finalize(paddedBytes);
    return CryptoJS.enc.Hex.stringify(cryptedBytes);
}


// let iv = "844182a9dfe9c5ca"


// let	key     = "57A891D97E332A9D"
const key = CryptoJS.enc.Utf8.parse("57A891D97E332A9D");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('844182a9dfe9c5ca');   //十六位十六进制数作为密钥偏移量

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


let aes_data = "4GCOq4Nh3pKsKZsXfMPRkrDOUQRcZuo3IGgyQg2C9s4VhSMG7ycWqqL5iCdIM1d1Wx2l4FteDxIKBhCAP+uBbnw09/M0Pym/F9mMqbPi/AoN4fY1hxtwEbL9VbpPjxW4ct9nBHIHykxyQc8R2bdVqOUEbXytTbXF29wgGgNB6NbE+LJmx3ofvbre9LtYrMVJdfbpQSpIwrICNmbrBfipXwNFuZxyUlKz4BkUKe/PqtHRZvmOojfOWJr8a/Q7aNBVVs9v8SECcb9BBc1Kzi5r6deZmTXH0l+AkSANKswSSmwR1l2cvsViDS8FS2aJCTZmMGgYYSK4A24B1AjCTRrscZOMHOdPxapxDLjhojN9JipffQ0puI1rJjghHofmNsXrNjVyvHvEDTWIDvzT6/LcVVSaUB7HuB263iYgIhToOIUYFJlX8Jg9MVMR15aZA3OSYGyJwo8V4lZEvjQyJXLxbnMNOARjHkI86Hi7L24Xba1al5s3ljF2izK61mrcSv6O4FPHdMinzpRY2zhxP/y666k454Ozr9F8t3RI26iljSRuAZcnigypvRwRwprUQWgVlLWmlgEjlzsfDF6xSS5qeARErIMaPBySEVT0Vjxi6MU="
let url = Decrypt(aes_data)

let src = url.split('.net/')[1]

console.log(`http://v16m-default.akamaized.net/${src}`)
// http://v16m-default.akamaized.net/f3e28499f2c4f65c0826c8e8fd68ae3d/65a2982a/video/tos/alisg/tos-alisg-ve-0051c001-sg/owBvflpBc2uEDwFNSxIsbAAQBngfIQnaO2mQkD/?a=2011&ch=0&cr=0&dr=0&net=5&cd=0%7C0%7C0%7C0&br=4782&bt=2391&bti=MzhALjBg&cs=0&ds=4&ft=XE5bCqT0mmjPD12gAM7R3wU7C1JcMeF~O5&mime_type=video_mp4&qs=0&rc=Nmk5aDQ7aWc4Z2hlaDw4aEBpM3I2OG05cjc8cDMzODYzNEAvYGIzNTJjNS8xL2AvYF8zYSNmanBrMmQ0a2FgLS1kMC1zcw%3D%3D&l=202401130739392647725AD6C3DF91BF10&btag=e000a8000