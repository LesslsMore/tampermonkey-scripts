

const axios = require('axios');

// https://api.dandanplay.net/api/v2/comment/178700014
// {
//     "fileName": "string",
//     "fileHash": "string",
//     "fileSize": 0,
//     "videoDuration": 0,
//     "matchMode": "hashAndFileName"
// }

// let api = `https://cas.dandanplay.net/`
// let Comment_GetAsync = `api/comment/`


// let url = `${api}${Comment_GetAsync}${episode}${id}`



// let episode = `17870`
// let animeId = `17870`

// let title = '药屋少女的呢喃'
// let id = `15`

let end_point = 'https://api.dandanplay.net'
let Comment_GetAsync = '/api/v2/comment/'
let Search_SearchAnimeAsync = `/api/v2/search/anime?keyword=`
let Related_GetRealtedAsync = `/api/v2/related/`
let Comment_GetExtCommentAsync = `/api/v2/extcomment?url=`

let animeId = `17910`
let id = `01`

main()

async function main() {
    let urls = await get_related_url(animeId, id)
    if (urls.length) {
        urls.forEach(async el => {
            // console.log(el.url)
            let danmus = await get_danmu_ext(el.url)
        });
        
    }
}


async function get_related_url(animeId, id) {
    let episodeId = id.padStart(4, "0");
    // console.log(episode); 
    let url = `${end_point}${Related_GetRealtedAsync}${animeId}${episodeId}`
    // console.log(url)
    let data = await axios_get(url)
    // let animeId = data.animes[0].animeId
    // console.log(data)
    return data.relateds
}

async function get_danmu_ext(related_url) {
    let url = `${end_point}${Comment_GetExtCommentAsync}${related_url}`
    // console.log(url)
    let data = await axios_get(url)
    // let animeId = data.animes[0].animeId
    console.log(data)
    return data.comments
}

// get_animeId(title)
// get_danmu(animeId, id)

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
    let data = await axios_get(url)
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
    let data = await axios_get(url)
    // let animeId = data.animes[0].animeId
    console.log(data)
    return data.comments
}