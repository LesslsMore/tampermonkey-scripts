// ==UserScript==
// @name         bili 分p 进度
// @namespace    https://github.com/zkytech/Tampermonkey_scripts
// @version      0.7.2
// @description  显示合集整体观看进度，方便掌控学习进度，合理安排学习时间。
// @author       lesslsmore
// @match        *://*.bilibili.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let total_duration = 0
    // 首先必须是BV链接才执行后面的程序

    if (window.location.pathname.includes("/video/BV") || (window.location.pathname.includes("/video/av") && window.location.search.includes("p="))) {
        let bvid = ""
        if (window.location.pathname.includes("/video/BV")) {
            bvid = window.location.pathname.split("/")[2].slice(2)
        } else {
            // av转bv
            const avid = window.location.pathname.split("/")[2].slice(2)
            console.log(avid)
        }
        console.log("bvid=", bvid)

        // 请求API获取合集信息
        fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`).then(res => res.json()).then(res => {
            const data = res.data
            console.log(data)
            // 合集整体进度显示
            const container = document.createElement("div")
            container.setAttribute("class", "bpx-player-ctrl-btn bpx-player-ctrl-part")
            container.innerHTML = 
            `
                <div class="bpx-player-ctrl-btn bpx-player-ctrl-time">
                    <input class="bpx-player-ctrl-time-seek" value="00:00" style="display: none;">
                    <div class="bpx-player-ctrl-time-label">

                        <span class="bpx-player-ctrl-time-current">08:31</span>
                        <span class="bpx-player-ctrl-time-divide">/</span>
                        <span class="bpx-player-ctrl-time-duration">13:42</span>

                        <span id="zky_finished_percent">  00.00%</span>
                    </div>
                </div>
            `

            // 底部左边 
            // 前面元素还未加载，所以在最左侧
            document.querySelector(".bpx-player-control-bottom-left").appendChild(container)
            // document.querySelector(".bpx-player-control-bottom-left").insertBefore(container)

        })
    }
    // 提示小圆点
    add_new_style(".zky_p_mark >  span:before{content:\"\";position:relative;top:50%;transform:translateY(-50%);right:0px;width: 5px;height: 5px;box-sizing: border-box;color: white;text-align: center;border-radius: 5px;display: inline-block;}")

    add_new_style(".zky_target_p > span:before {" +
        "background: #52C41A " +
        "}")
    add_new_style(".zky_progress_p > span:before {" +
        "background: #FADB14" +
        "}")

    /**
     * 获取观看目标的分P序列号
     * @param {string} bvid
     * @param {any[]} data
     */
    function get_target_p(bvid, data) {
        let target_p = 0
        let __temp_duration = 0
        localStorage[`zky_target_${bvid}`] && data.pages.some((v, i) => {
            __temp_duration += v.duration
            target_p = i
            return __temp_duration >= localStorage[`zky_target_${bvid}`] ? true : false
        })
        return target_p + 1
    }

    /**
     * 获取当前分P序列号
     */
    function get_current_p() {
        let current_p = getQueryVariable("p") // 当前分P序列号
        // 如果路径中没有分p的id，当前分p就是1
        if (current_p === false) {
            current_p = 1
        }
        return Number(current_p)
    }

    /**
     * 当元素出现时，执行函数
     * @param {function} fn 需要执行的函数
     * @param {string} elem_selector 元素选择器
     */
    function exec_when_element_exist(fn, elem_selector) {
        const __interval_a = setInterval(function () {
            if (document.querySelector(elem_selector) !== null) {
                clearInterval(__interval_a)
                fn()
            }
        }, 500)
    }
    /**
     * 将"01:00:00"格式的时间转换为秒数
     * @param {string} time_str 格式为"01:00:00"时间字符串
     */
    function str_to_seconds(time_str) {
        const time_nums = time_str.split(":").map(val => Number(val)).reverse()
        return time_nums[0] + time_nums[1] * 60 + (time_nums[2] ? time_nums[2] * 60 * 60 : 0)
    }

    /**
     * 将秒数转换为"01:00:00"的格式
     * @param {number} seconds_num 秒数
     */
    function format_seconds(seconds_num) {
        const seconds = seconds_num % 60
        const minutes = (seconds_num % 3600 - seconds) / 60
        const hours = Math.floor(seconds_num / 3600)
        const seconds_str = seconds > 9 ? seconds + "" : `0${seconds}`
        const minutes_str = minutes > 9 ? minutes + ":" : `0${minutes}:`
        const hours_str = hours === 0 ? '' : hours > 9 ? hours + ":" : `0${hours}:`
        return `${hours_str}${minutes_str}${seconds_str}`
    }
    /**
     * 获取url路径参数值
     * @param {string} variable 需要查询的参数名
     */
    function getQueryVariable(variable) {
        const query = window.location.search.substring(1);
        const vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    }
    /**
     * 全局引入自定义style文本
     * @param {string} newStyle css文本
     */
    function add_new_style(newStyle) {
        let styleElement = document.getElementById('zk_styles_js');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'zk_styles_js';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newStyle));
    }
})();