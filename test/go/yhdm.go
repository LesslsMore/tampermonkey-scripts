package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
    "regexp"
    "strings"
    "crypto/cipher"
    "crypto/aes"
    "bytes"
    "encoding/base64"

)
var iv string = "844182a9dfe9c5ca"
const (
    key = "57A891D97E332A9D"
    url_dom="https://www.yhdm52.com"
)
func main() {
    video_get("https://www.yhdm52.com/video/581.html")

}

func video_get(url string) string {
    var html string = http_get(url)
    re := regexp.MustCompile("(/play/[\\d]+-1-\\d+.html)"&gt;")
    matches := re.FindAllStringSubmatch(html, -1)
    for _, match := range matches {
        fmt.Println("url:", url_dom+match[1])
        fmt.Println(mp4_get(url_dom+match[1]))
    }
    return string("")
}

func mp4_get(url string) string {
    var aes_data=string(aes_get(url))
    ds, _ := AesDecrypt(aes_data, []byte(key))
    //fmt.Println(string(ds))
    //iv 不一致进行处理
    match,_:=regexp.MatchString(",|"|!|;|{|}|`|#",string(ds))
    if match {
        re := regexp.MustCompile(".+akamaized.net")
        match := re.FindString(string(ds))
        jsonString2 := strings.ReplaceAll(string(ds),string(match),"http://v16m-default.akamaized.net")
        //fmt.Println(jsonString2)
        //fmt.Println("agsec-iv 不一致进行处理")
        return string(jsonString2)

    }else{
        //fmt.Println("agsec-成功")
        return string(ds)
    }
}

func aes_get(url string) string {
    var m3u8_get_html string = m3u8_get(url)
    var html string = http_get("https://danmu.yhdmjx.com/m3u8.php?url="+m3u8_get_html)
    re := regexp.MustCompile("getVideoInfo\\("[^"]+")
    match := re.FindString(html)
    jsonString2 := strings.ReplaceAll(string(match), "getVideoInfo("", "")
    re = regexp.MustCompile("bt_token = "([^"]+)"")
    matches := re.FindAllStringSubmatch(html, -1)
    for _, match := range matches {
        //fmt.Println("iv:", match[1])
        iv=match[1]
    }
    return jsonString2
}

func m3u8_get(url string) string {
    var html_a string =string(http_get(url))
    re := regexp.MustCompile(""url":"[^"]+","url_next"")
    match := re.FindString(html_a)
    jsonString := strings.ReplaceAll(string(match), ""url":"", "")
    jsonString = strings.ReplaceAll(string(jsonString), "","url_next"", "")
    re = regexp.MustCompile("&lt;title&gt;[^.]+&lt;/title&gt;")
    match = re.FindString(html_a)
    jsonString2 := strings.ReplaceAll(string(match), "&lt;title&gt;", "")
    jsonString2 = strings.ReplaceAll(string(jsonString2), "&lt;/title&gt;", "")
    jsonString2 = strings.ReplaceAll(string(jsonString2), "- 免费观看-在线观看完整版无修-樱花动漫网-无广告弹窗的动漫门户", "")
    fmt.Println(jsonString2)
    return jsonString
}

func http_get(url string) string {
    client := &amp;http.Client{}

    // 创建一个 GET 请求
    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return "-1"
    }

    // 发送请求并获取响应
    resp, err := client.Do(req)
    if err != nil {
        return "-1"
    }

    // 关闭响应体
    defer resp.Body.Close()

    // 输出响应状态码和响应体
    if resp.Status != "200 OK" {
        return string(resp.Status)
    }
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Println("Error reading response body:", err)
        return "-1"
    }
    return string(body)

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