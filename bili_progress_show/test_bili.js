// document.querySelector("#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div.base-video-sections-v1 > div.video-sections-content-list > div > div.video-section-list.section-0")

// document.querySelector(".bpx-player-control-bottom-left")

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

var box_list = document.getElementsByClassName('list-box')[0].children;

let time_list = []
let on = 0

Array.from(box_list).forEach(
    (el, idx) => {
        if (el.className.includes('on')) {
            on = idx
        }
        let dat = el.innerText.split('\n')
        let part = dat[1]
        let time = str_to_seconds(dat[2])
        // console.log(dat)
        time_list.push(time)
    }
)

let time_pre = on === 0 ? 0 : eval(time_list.slice(0, on).join("+"))
let time_sum = eval(time_list.join("+"))
let process = (time_pre * 100 / time_sum).toFixed(2)

time_list.reduce(function(acr, cur){
    return acr + cur;
  })

console.log(format_seconds(time_pre))
console.log(format_seconds(time_sum))
console.log(`${process} %`)

const container = document.createElement("div")
container.innerHTML = 
`
    <span class="cur-page">${format_seconds(time_pre)} / ${format_seconds(time_sum)}</span>
    <span class="cur-page">${process} %</span>
`

document.querySelector(".bui-dropdown-display").appendChild(container)
document.querySelector(".bui-area").appendChild(container)

document.querySelector(".head-con").insertBefore(container, document.querySelector(".head-right"))




const container = document.createElement("div")
container.innerHTML = 
    `<div style="height: 200px; width: 20px; border: 1px solid black;">
        <div id="progress" style="height: 0px; width: 100%; background-color: green;"></div>
    </div>`

// 播放器


let video = document.querySelector(".bpx-player-video-wrap")
let high = video.offsetHeight
let wide = video.offsetWidth

let width = 5
const container = document.createElement("div")
container.style.width = `${width}px`
container.style.height = `${high}px`
container.style.backgroundColor = "#00a1d6"
container.style.position = "absolute";
container.style.top = "0px";
container.style.left = `${wide - width}px` 

video.appendChild(container)

var progress = document.getElementById("progress");
var percent = 100; // 进度百分比
progress.style.height = percent + "%";

var boxtext=box.innerText;
var textline=boxtext.replace(/\n(?!P\d+)/g,' ');
console.log(textline);
