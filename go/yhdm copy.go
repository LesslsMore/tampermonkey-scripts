package main

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"fmt"
	"regexp"
	"strings"
)

var iv string = "844182a9dfe9c5ca"

const (
	key     = "57A891D97E332A9D"
	url_dom = "https://www.yhdm52.com"
)

func main() {
	fmt.Printf("test(): %v\n", test())
}

func test() string {

	// "https://danmu.yhdmjx.com/m3u8.php?url=g%2F%2FApmx8Ufn%2FoKvI6thJ50BVbLyI%2B70byzh2P8doZfbWLq1D2vo%2BJ2u8VLd1nL9JBANotbqvO2Mt2qlTz5kRmA%3D%3D"

	var aes_data = "4GCOq4Nh3pKsKZsXfMPRkrDOUQRcZuo3IGgyQg2C9s4VhSMG7ycWqqL5iCdIM1d1Wx2l4FteDxIKBhCAP+uBbnw09/M0Pym/F9mMqbPi/AoN4fY1hxtwEbL9VbpPjxW4ct9nBHIHykxyQc8R2bdVqOUEbXytTbXF29wgGgNB6NbE+LJmx3ofvbre9LtYrMVJdfbpQSpIwrICNmbrBfipXwNFuZxyUlKz4BkUKe/PqtHRZvmOojfOWJr8a/Q7aNBVVs9v8SECcb9BBc1Kzi5r6deZmTXH0l+AkSANKswSSmwR1l2cvsViDS8FS2aJCTZmMGgYYSK4A24B1AjCTRrscZOMHOdPxapxDLjhojN9JipffQ0puI1rJjghHofmNsXrNjVyvHvEDTWIDvzT6/LcVVSaUB7HuB263iYgIhToOIUYFJlX8Jg9MVMR15aZA3OSYGyJwo8V4lZEvjQyJXLxbnMNOARjHkI86Hi7L24Xba1al5s3ljF2izK61mrcSv6O4FPHdMinzpRY2zhxP/y666k454Ozr9F8t3RI26iljSRuAZcnigypvRwRwprUQWgVlLWmlgEjlzsfDF6xSS5qeARErIMaPBySEVT0Vjxi6MU="

	// var aes_data = "9HPmpn6HoOxp16PXvhFZ+aJoOO56i+g61sqdM6Xkj+RioVNDOOmM8CexJT1RVBO0VzpmXzcdgo3LFA36Y+mfRqi6V7jV2A1R6dqvtNoBO9Ie4tqaF2FqS9zz8Sg3VQ9dURCAkaDw267XYRp682aob4hrUFnFTDlmfHDFyiFaS9rMay4g5D4ZRB0Td5rgGuEOlmWVXBT22/GQaTETaKTdDWQgvGVCQWby6BJleSEOSKRVazWvG6NPIjFZFqzBZDq2eArBcxMRhOUQGkbFJBQav5KrCXu7pN3iUtXWQNzXjhvkpIzzBkG8oW3SZL35OgU8gwtL8+mrP2Ogu4noRc741cJkNBamQxs+phkAb6m91ay/KCaMmvljZimL7Ye/DEV4zHnF56uI4V9gy4mmgQdhlXnRnD5VDpNyxKhnnYs/sXrCgyK6fPLp+vwB2WwvlZwp3EnDq1xaNJOy98DuCQ/IAgQbT8jMj4Jcwl4IPyGS/tXFvMBEdh8SmpttFi2fVlCNaKLfWiee/jxS4sNBbVz1KjIgTj6DHgBk4SOZk3sGG4Iio6q6jSBxu09DaUKASk3Ht03ClYDAsn5EQKQ3xFDNoD8GsmO8gG3GQX+lH4hrLoQ="
	ds, _ := AesDecrypt(aes_data, []byte(key))
	fmt.Println(string(ds))
	// match,_:=regexp.MatchString(",|"|!|;|{|}|`|#",string(ds))
	var match = true
	if match {
		re := regexp.MustCompile(".+akamaized.net")
		match := re.FindString(string(ds))
		jsonString2 := strings.ReplaceAll(string(ds), string(match), "http://v16m-default.akamaized.net")
		//fmt.Println(jsonString2)
		//fmt.Println("agsec-iv 不一致进行处理")
		return string(jsonString2)

	} else {
		//fmt.Println("agsec-成功")
		return string(ds)
	}
}

func AesEncrypt(encodeStr string, key []byte) (string, error) {
	encodeBytes := []byte(encodeStr)
	//根据key 生成密文
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	blockSize := block.BlockSize()
	encodeBytes = PKCS5Padding(encodeBytes, blockSize)

	blockMode := cipher.NewCBCEncrypter(block, []byte(iv))
	crypted := make([]byte, len(encodeBytes))
	blockMode.CryptBlocks(crypted, encodeBytes)

	return base64.StdEncoding.EncodeToString(crypted), nil
}

func PKCS5Padding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	//填充
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)

	return append(ciphertext, padtext...)
}

func AesDecrypt(decodeStr string, key []byte) ([]byte, error) {
	//先解密base64
	decodeBytes, err := base64.StdEncoding.DecodeString(decodeStr)
	if err != nil {
		return nil, err
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	blockMode := cipher.NewCBCDecrypter(block, []byte(iv))
	origData := make([]byte, len(decodeBytes))

	blockMode.CryptBlocks(origData, decodeBytes)
	origData = PKCS5UnPadding(origData)
	return origData, nil
}

func PKCS5UnPadding(origData []byte) []byte {
	length := len(origData)
	unpadding := int(origData[length-1])
	return origData[:(length - unpadding)]
}
