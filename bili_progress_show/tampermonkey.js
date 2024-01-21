// ==UserScript==
// @name         bili-part-video-search
// @namespace    http://tampermonkey.net/
// @version      2024-01-06
// @description  try to take over the world!
// @author       You
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://*.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==

function get_item_info(data){
    // console.log(data)
    const json = JSON.parse(data);
    // console.log(json)
    // console.log(json.data.pages)
    console.log(`每 bvid 下 cid 数：${json.data.pages.length}`)
    // https://www.bilibili.com/video/BV19K4y1L7MT?p=57
    let item_info = []
    let bvid = json.data.bvid
    json.data.pages.forEach(el => {
        let url = `https://www.bilibili.com/video/${bvid}?p=${el.page}`
        // console.log(url)
        console.log(el.part)
        let mid = json.data.owner.mid
        let name = json.data.owner.name
        let view = json.data.stat.view
  
        let page = el.page
        let cid = el.cid
        let part = el.part
        let duration = el.duration
  
        item_info.push({
          name,
          mid,
          bvid,
          cid,
          url,
          page,
  
          view,
  
          duration,
          part, 
        })
      }
    )
    return item_info
  }

function get_bvid_info() {
    // 'use strict';
    // let bvid = window.__INITIAL_STATE__.bvid
    // console.log(bvid)

    let windowObject = unsafeWindow || window;
    let bvid = windowObject.__INITIAL_STATE__.bvid
    console.log(bvid)

    GM_xmlhttpRequest({
        url:`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
        method :"GET",
        onload:function(xhr){
            // console.log(xhr.responseText);
            let item = get_item_info(xhr.responseText)
            console.log(item)
        }
    });
}
get_bvid_info()