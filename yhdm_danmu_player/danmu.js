// ==UserScript==
// @name         风车动漫 artplayer
// @namespace    http://tampermonkey.net/
// @version      2024-01-21
// @description  try to take over the world!
// @author       You
// @match        https://www.dmla4.com/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
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

main()

async function main() {
    let title = document.querySelector(".stui-player__detail.detail > h1 > a")
    if (title == undefined) {
        title = document.querySelector(".myui-panel__head.active.clearfix > h3 > a")
    }
    title = title.innerText
    console.log(title)
    
    let url = window.location.href
    let episodeId = url.split('-').pop().split('.')[0]
    
    console.log(url);
    console.log(episodeId)

    let animeId = await get_animeId(title)
    let danmu = await get_danmu(animeId, episodeId)

    let urls = await get_related_url(animeId, episodeId)
    if (urls.length) {
        urls.forEach(async el => {
            // console.log(el.url)
            let danmu_ext = await get_danmu_ext(el.url)
            danmu = [...danmu, ...danmu_ext]
        });
        
    }

    let danmus = bilibiliDanmuParseFromJson(danmu)
    console.log(danmus)
}

async function get_related_url(animeId, id) {
    let episodeId = id.padStart(4, "0");
    // console.log(episode); 
    let url = `${end_point}${Related_GetRealtedAsync}${animeId}${episodeId}`
    // console.log(url)
    let data = await xhr_get(url)
    data = JSON.parse(data)
    // let animeId = data.animes[0].animeId
    // console.log(data)
    return data.relateds
}

async function get_danmu_ext(related_url) {
    let url = `${end_point}${Comment_GetExtCommentAsync}${related_url}`
    console.log(url)
    let data = await xhr_get(url)
    data = JSON.parse(data)

    // let animeId = data.animes[0].animeId
    // console.log(data.count)
    return data.comments
}



async function axios_get(url) {
    try {
      const response = await axios.get(url);
      return response.data
    } catch (error) {
      console.error(error);
    }
  }

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

async function get_danmu(animeId, id) {
    
    let episodeId = id.padStart(4, "0");
    // console.log(episode); 
    let url = `${end_point}${Comment_GetAsync}${animeId}${episodeId}`
    // console.log(url)
    let data = await xhr_get(url)
    data = JSON.parse(data)
    // let animeId = data.animes[0].animeId
    // console.log(data)
    return data.comments
}

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