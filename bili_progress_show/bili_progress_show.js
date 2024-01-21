// ==UserScript==
// @name         Bilibili 合集进度显示
// @namespace    https://github.com/LesslsMore/tampermonkey-scripts/tree/master/bili_progress_show
// @version      0.1.0
// @description  显示合集整体观看进度，方便掌控学习进度，合理安排学习时间。
// @author       lesslsmore
// @license      MIT
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {

exec_when_element_exist(show_proc_info, ".list-box")

function add_proc_info(time_pre, time_sum) {
    let process = (time_pre * 100 / time_sum).toFixed(2)
    
    console.log(format_seconds(time_pre))
    console.log(format_seconds(time_sum))
    console.log(`${process} %`)

    const container = document.createElement("div")
    container.setAttribute("class", "cur-proc-info")
    let info = `
        <span class="cur-page">${format_seconds(time_pre)} / ${format_seconds(time_sum)}</span>
        &nbsp;
        <span class="cur-page">${process} %</span>
    `
    container.innerHTML = info

    let cur_proc_info = document.querySelector('.cur-proc-info')
    if (cur_proc_info) {
        // cur_proc_info.remove()
        cur_proc_info.innerHTML = info
    } else {
        var display = document.querySelector(".bui-dropdown-display")
        display.appendChild(container)
        // exec_when_element_exist(function() {
        //     var display = document.querySelector(".bui-dropdown-display")
        //     display.appendChild(container)
        //     // display.addEventListener("DOMNodeInserted", function(event) {
        //     //         display.appendChild(container)
        //     //     }
        //     // )
        // }, ".bui-dropdown-display")
    }
}

function get_proc_info(box) {
    let box_list = box.children
    // console.log(box_list.length)
    let time_list = []
    let on = 0
    // let items = Array.from(box_list)
    // console.log(items)
    Array.from(document.querySelector('.list-box').children)
    Array.from(box_list).forEach(
        (el, idx) => {
            if (el.className.includes('on')) {
                on = idx
            }
            // console.log(el)
            // console.log(el.innerText)
            // console.log(el.textContent)
            // console.log(el.querySelector('.duration').textContent)
            let dat = el.innerText.split('\n')
            // console.log(dat)
            let part = dat[1]
            // console.log(dat[2])
            let time = str_to_seconds(dat[2])
            
            time_list.push(time)
        }
    )

    let time_pre = on === 0 ? 0 : eval(time_list.slice(0, on).join("+"))
    let time_sum = eval(time_list.join("+"))
    

    time_list.reduce(function(acr, cur){
        return acr + cur;
    })
    return {time_pre, time_sum}
}

function get_cur_info() {
    let cur_page = document.querySelector('.cur-page')
    let cur = cur_page.innerText.slice(1,-1).split("/")
    let curr = parseInt(cur[0])
    let len = parseInt(cur[1])
    console.log(`cur: ${curr}`)
    console.log(`len: ${len}`)
    return {curr, len}
}

function show_proc_info() {
    var box = document.querySelector('.list-box');

    let observerOptions = {
        childList: true, // 观察目标子节点的变化，添加或删除
        attributes: true, // 观察属性变动
        subtree: true,
    }
    
    function callback(mutationList, observer) {
        // console.log(box.children)
        // console.log(mutationList)

        let {cur, len} = get_cur_info()
        let {time_pre, time_sum} = get_proc_info(box)
        add_proc_info(time_pre, time_sum)
    }

    var observer = new MutationObserver(callback);
    observer.observe(box, observerOptions);
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

})();