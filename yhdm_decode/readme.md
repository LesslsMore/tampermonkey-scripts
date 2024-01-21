
# 樱花动漫、风车动漫原始播放地址获取

# 1
https://www.dmla4.com/play/7069-1-1.html

# 2
获取网页中 player_aaaa 中的 url
```js
var player_aaaa={"flag":"play","encrypt":0,"trysee":0,"points":0,"link":"\/play\/7069-1-1.html","link_next":"\/play\/7069-1-2.html","link_pre":"",
"url":"g%2F%2FApmx8Ufn%2FoKvI6thJ50BVbLyI%2B70byzh2P8doZfbWLq1D2vo%2BJ2u8VLd1nL9JBANotbqvO2Mt2qlTz5kRmA%3D%3D",
"url_next":"6nvTIZK6u5tUydCjO7iHCD3eV6EvREZuhYSp3i4qqVs1Pw1BBiqLw54hndKxY5L9G82o7J%2FPUFvm0I%2FmAUDYvQ%3D%3D",
"from":"mp4","server":"no","note":"","id":"7069","sid":1,"nid":1}
```

# 3
通过 m3u8 接口查询 url   
https://danmu.yhdmjx.com/m3u8.php?url=

# 4
通过 getVideoInfo 函数获取原始播放地址

从 m3u8 中获取 bt_token 作为 iv
```js
var config = {
    "id": "20e9d1ba9fe5a6e29c9cd04a1ec04b42",
	"api":"//danmu.yhdmjx.com",//弹幕接口   前面架设自己的域名 防止后台弹幕库报错    例如   https://www.baidu.co
	"key": "yhdm",//应用KEY码,如果不填将获取全部弹幕信息(填写后指定应用弹幕)
	"url": getVideoInfo("9HPmpn6HoOxp16PXvhFZ+aJoOO56i+g61sqdM6Xkj+RioVNDOOmM8CexJT1RVBO0VzpmXzcdgo3LFA36Y+mfRqi6V7jV2A1R6dqvtNoBO9Ie4tqaF2FqS9zz8Sg3VQ9dURCAkaDw267XYRp682aob4hrUFnFTDlmfHDFyiFaS9rMay4g5D4ZRB0Td5rgGuEOlmWVXBT22/GQaTETaKTdDWQgvGVCQWby6BJleSEOSKRVazWvG6NPIjFZFqzBZDq2eArBcxMRhOUQGkbFJBQav5KrCXu7pN3iUtXWQNzXjhvkpIzzBkG8oW3SZL35OgU8gwtL8+mrP2Ogu4noRc741cJkNBamQxs+phkAb6m91ay/KCaMmvljZimL7Ye/DEV4zHnF56uI4V9gy4mmgQdhlXnRnD5VDpNyxKhnnYs/sXrCgyK6fPLp+vwB2WwvlZwp3EnDq1xaNJOy98DuCQ/IAgQbT8jMj4Jcwl4IPyGS/tXFvMBEdh8SmpttFi2fVlCNaKLfWiee/jxS4sNBbVz1KjIgTj6DHgBk4SOZk3sGG4Iio6q6jSBxu09DaUKASk3Ht03ClYDAsn5EQKQ3xFDNoD8GsmO8gG3GQX+lH4hrLoQ="),//视频链接
	"sid":"",//集数id
	"pic":"",//视频封面
	"title":"",//视频标题
	"next":"",//下一集链接
	"user": "",//用户名
	"group": "",//用户组
	}
```

# 5
将 getVideoInfo 参数解码得到原始播放地址    
http://v16m-default.akamaized.net/a2ad617d1cbd1f095d6f728ae642a62f/65a29111/video/tos/alisg/tos-alisg-ve-0051c001-sg/owBvflpBc2uEDwFNSxIsbAAQBngfIQnaO2mQkD/?a=2011&ch=0&cr=0&dr=0&net=5&cd=0%7C0%7C0%7C0&br=4782&bt=2391&bti=MzhALjBg&cs=0&ds=4&ft=XE5bCqT0mmjPD126UM7R3wU7C1JcMeF~O5&mime_type=video_mp4&qs=0&rc=Nmk5aDQ7aWc4Z2hlaDw4aEBpM3I2OG05cjc8cDMzODYzNEAvYGIzNTJjNS8xL2AvYF8zYSNmanBrMmQ0a2FgLS1kMC1zcw%3D%3D&l=20240113070922599908F5AA178D8BB8EA&btag=e000a8000

# 6
```js
CryptoJS.enc.Utf8.stringify(_token_key)
'57A891D97E332A9D'
CryptoJS.enc.Utf8.stringify(_token_iv)
'53484c0cb974e590'
player_aaaa.url
'g%2F%2FApmx8Ufn%2FoKvI6thJ50BVbLyI%2B70byzh2P8doZfbWLq1D2vo%2BJ2u8VLd1nL9JBANotbqvO2Mt2qlTz5kRmA%3D%3D'
```

# 参考
https://agsec.org/archives/205