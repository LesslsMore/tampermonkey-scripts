// ==UserScript==
// @name         樱花动漫、风车动漫弹幕播放
// @namespace    https://github.com/lesslsmore
// @version      0.1.0
// @description  显示合集整体观看进度，方便掌控学习进度，合理安排学习时间。
// @author       lesslsmore
// @license      MIT
// @match        https://www.dmla4.com/play/*

// @connect      https://api.dandanplay.net/*
// @connect      https://danmu.yhdmjx.com/*
// @connect      http://v16m-default.akamaized.net/*
// @connect      self
// @connect      *
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.js
// @require      https://unpkg.com/artplayer/dist/artplayer.js
// @require      https://unpkg.com/artplayer-plugin-danmuku/dist/artplayer-plugin-danmuku.js

// ==/UserScript==

let end_point = 'https://api.dandanplay.net'
let Comment_GetAsync = '/api/v2/comment/'
let Search_SearchAnimeAsync = `/api/v2/search/anime?keyword=`
let Related_GetRealtedAsync = `/api/v2/related/`
let Comment_GetExtCommentAsync = `/api/v2/extcomment?url=`
const key = CryptoJS.enc.Utf8.parse("57A891D97E332A9D");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('844182a9dfe9c5ca');   //十六位十六进制数作为密钥偏移量

main()

async function main() {
    let url = window.location.href
    let id = url.split('-').pop().split('.')[0]


    let title = document.querySelector(".stui-player__detail.detail > h1 > a")
    if (title == undefined) {
        title = document.querySelector(".myui-panel__head.active.clearfix > h3 > a")
    }
    title = title.innerText

    console.log(url)
    console.log(id)
    console.log(title)


    let animeId = await get_animeId(title)

    id = id.padStart(4, "0");
    let episodeId = `${animeId}${id}`
    console.log(episodeId)

    let danmu = await get_danmu(episodeId)
    let urls = await get_related_url(episodeId)
    // console.log(urls)
    if (urls.length > 0) {
        for(let i = 0; i < urls.length; i++) {
            let danmu_ext = await get_danmu_ext(urls[i].url)
            danmu = [...danmu, ...danmu_ext]
        }
    }

    let danmus = bilibiliDanmuParseFromJson(danmu)
    console.log('总共弹幕数目：')
    console.log(danmus.length)    

    let src_url = await get_yhdm_url(url)
    
    re_render()


    Artplayer_build(src_url, danmus)
}

// 封装 xhr 为 promise 同步方法
function xhr_get(url){
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: url,
            method :"GET",
            headers: {
            },
            onload:function(xhr){
                resolve(xhr.responseText)

            }
        });
    })
}

// 匹配 m3u8 地址
function get_m3u8_url(data) {
    let regex = /"url":"([^"]+)","url_next":"([^"]+)"/g;

    const matches = data.match(regex);
  
    if (matches) {
      let play = JSON.parse(`{${matches[0]}}`)
  
      let m3u8 = `https://danmu.yhdmjx.com/m3u8.php?url=${play.url}`
      console.log(m3u8)
      return m3u8
    } else {
      console.log('No matches found.');
    }
}

// 匹配加密 url
function get_encode_url(data) {
    regex = /getVideoInfo\("([^"]+)"/;
    
    const matches = data.match(regex);
  
    if (matches) {
        return matches[1]
    } else {
      console.log('No matches found.');
    }
}

// 解密
function Decrypt(srcs) {
    // let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

// 获取原始 url
async function get_yhdm_url(url){
   let body = await xhr_get(url)
//    console.log(body)
   let m3u8 = get_m3u8_url(body)
//    console.log(m3u8)
   if (m3u8) {
        let body = await xhr_get(m3u8)
        let aes_data = get_encode_url(body)
        if (aes_data) {

            let url = Decrypt(aes_data)
            // console.log(url)
            let src = url.split('.net/')[1]
            let src_url = `http://v16m-default.akamaized.net/${src}`
            console.log('原始地址：')
            console.log(src_url)
            return src_url            
        }
    }
}

// 删除元素，添加容器
function re_render() {
    let player = document.querySelector(".stui-player__video.clearfix")
    if (player == undefined) {
        player = document.querySelector("#player-left")
    }
    let div = player.querySelector('div')
    let h = div.offsetHeight
    let w = div.offsetWidth

    player.removeChild(div)

    let app = `<div style="height: ${h}px; width: ${w}px;" class="artplayer-app"></div>`
    player.innerHTML = app
}

// 加载 url danmu 播放器
function Artplayer_build(src_url, danmus) {
    var art = new Artplayer({
        container: '.artplayer-app',
        url: src_url,
        autoSize: true,
        fullscreen: true,
        fullscreenWeb: true,
        autoOrientation: true,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        setting: true,
        plugins: [
            artplayerPluginDanmuku({
                danmuku: danmus,
                speed: 5, // 弹幕持续时间，单位秒，范围在[1 ~ 10]
                opacity: 1, // 弹幕透明度，范围在[0 ~ 1]
                fontSize: 25, // 字体大小，支持数字和百分比
                color: '#FFFFFF', // 默认字体颜色
                mode: 0, // 默认模式，0-滚动，1-静止
                margin: [10, '25%'], // 弹幕上下边距，支持数字和百分比
                antiOverlap: true, // 是否防重叠
                useWorker: true, // 是否使用 web worker
                synchronousPlayback: false, // 是否同步到播放速度
                filter: (danmu) => danmu.text.length < 50, // 弹幕过滤函数，返回 true 则可以发送
                lockTime: 5, // 输入框锁定时间，单位秒，范围在[1 ~ 60]
                maxLength: 100, // 输入框最大可输入的字数，范围在[0 ~ 500]
                minWidth: 200, // 输入框最小宽度，范围在[0 ~ 500]，填 0 则为无限制
                maxWidth: 600, // 输入框最大宽度，范围在[0 ~ Infinity]，填 0 则为 100% 宽度
                theme: 'light', // 输入框自定义挂载时的主题色，默认为 dark，可以选填亮色 light
                heatmap: true, // 是否开启弹幕热度图, 默认为 false
                beforeEmit: (danmu) => !!danmu.text.trim(), // 发送弹幕前的自定义校验，返回 true 则可以发送

                // 通过 mount 选项可以自定义输入框挂载的位置，默认挂载于播放器底部，仅在当宽度小于最小值时生效
                // mount: document.querySelector('.artplayer-danmuku'),
            }),
        ],
        controls: [
            {
                position: 'right',
                html: '上传弹幕',
                click: function () {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "text/xml";
                    input.addEventListener("change", () => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            // console.log(reader)
                            const xml = reader.result;
                            // console.log(xml)
                            let dm = bilibiliDanmuParseFromXml(xml)
                            console.log(dm)
                            art.plugins.artplayerPluginDanmuku.config({
                                danmuku: dm,
                            });
                            art.plugins.artplayerPluginDanmuku.load();
                        };
                        reader.readAsText(input.files[0]);
                    });
                    input.click();


                },
            },
        ],
    });

    // 监听手动输入的弹幕，保存到数据库
    art.on('artplayerPluginDanmuku:emit', (danmu) => {
        console.info('新增弹幕', danmu);
    });

    // 监听加载到的弹幕数组
    art.on('artplayerPluginDanmuku:loaded', (danmus) => {
        console.info('加载弹幕', danmus.length);
    });

    // 监听加载到弹幕的错误
    art.on('artplayerPluginDanmuku:error', (error) => {
        console.info('加载错误', error);
    });

    // 监听弹幕配置变化
    art.on('artplayerPluginDanmuku:config', (option) => {
        console.info('配置变化', option);
    });

    // 监听弹幕停止
    art.on('artplayerPluginDanmuku:stop', () => {
        console.info('弹幕停止');
    });

    // 监听弹幕开始
    art.on('artplayerPluginDanmuku:start', () => {
        console.info('弹幕开始');
    });

    // 监听弹幕隐藏
    art.on('artplayerPluginDanmuku:hide', () => {
        console.info('弹幕隐藏');
    });

    // 监听弹幕显示
    art.on('artplayerPluginDanmuku:show', () => {
        console.info('弹幕显示');
    });

    // 监听弹幕销毁
    art.on('artplayerPluginDanmuku:destroy', () => {
        console.info('弹幕销毁');
    });
}

function getMode(key) {
    switch (key) {
        case 1:
        case 2:
        case 3:
            return 0;
        case 4:
        case 5:
            return 1;
        default:
            return 0;
    }
}

// 将 danmu xml 字符串转为 bilibili 格式 
function bilibiliDanmuParseFromXml(xmlString) {
    if (typeof xmlString !== 'string') return [];
    const matches = xmlString.matchAll(/<d (?:.*? )??p="(?<p>.+?)"(?: .*?)?>(?<text>.+?)<\/d>/gs);
    return Array.from(matches)
        .map((match) => {
            const attr = match.groups.p.split(',');
            if (attr.length >= 8) {
                const text = match.groups.text
                    .trim()
                    .replaceAll('&quot;', '"')
                    .replaceAll('&apos;', "'")
                    .replaceAll('&lt;', '<')
                    .replaceAll('&gt;', '>')
                    .replaceAll('&amp;', '&');

                return {
                    text,
                    time: Number(attr[0]),
                    mode: getMode(Number(attr[1])),
                    fontSize: Number(attr[2]),
                    color: `#${Number(attr[3]).toString(16)}`,
                    timestamp: Number(attr[4]),
                    pool: Number(attr[5]),
                    userID: attr[6],
                    rowID: Number(attr[7]),
                };
            } else {
                return null;
            }
        })
        .filter(Boolean);
}

// 将 danmu json 转为 bilibili 格式 
function bilibiliDanmuParseFromJson(jsonString) {
    return jsonString.map((comment) => {
        let attr = comment.p.split(',');
        return {
            text: comment.m,
            time: Number(attr[0]),
            mode: getMode(Number(attr[1])),
            fontSize: Number(25),
            color: `#${Number(attr[2]).toString(16)}`,
            timestamp: Number(comment.cid),
            pool: Number(0),
            userID: attr[3],
            rowID: Number(0),
        }
    })
}

// 获取 danmu 中 animeId
async function get_animeId(title) {
    let url = `${end_point}${Search_SearchAnimeAsync}${title}`
    let data = await xhr_get(url)
    data = JSON.parse(data)
    // console.log(data)
    let {animeId, animeTitle} = data.animes[0]
    console.log(animeId)
    console.log(animeTitle)
    return animeId
}

// 获取原始 danmu 
async function get_danmu(episodeId) {
    let url = `${end_point}${Comment_GetAsync}${episodeId}`
    // console.log(url)
    let data = await xhr_get(url)
    data = JSON.parse(data)
    // let animeId = data.animes[0].animeId
    console.log('获取原始 danmu 数目：')
    console.log(data.count)
    return data.comments
}

// 获取视频相关 url
async function get_related_url(episodeId) {
    let url = `${end_point}${Related_GetRealtedAsync}${episodeId}`
    console.log('获取视频相关 url')
    console.log(url)
    let data = await xhr_get(url)
    data = JSON.parse(data)
    // let animeId = data.animes[0].animeId
    // console.log(data)
    return data.relateds
}

// 获取扩展 danmu 
async function get_danmu_ext(related_url) {
    let url = `${end_point}${Comment_GetExtCommentAsync}${related_url}`
    console.log(url)
    let data = await xhr_get(url)
    data = JSON.parse(data)

    // let animeId = data.animes[0].animeId
    console.log('获取扩展 danmu 数目：')
    console.log(data.count)
    return data.comments
}
