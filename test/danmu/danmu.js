



const fs = require('fs');

let xml = 'danmu/[ANi] 憧憬成為魔法少女 [年齡限制版] - 01 [1080P][Baha][WEB-DL][AAC AVC][CHT].xml'
let json = 'danmu/[ANi] 憧憬成為魔法少女 [年齡限制版] - 01 [1080P][Baha][WEB-DL][AAC AVC][CHT].json'
// fs.readFile(xml, 'utf8', (err, data) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     // console.log(data)

//     let dm = bilibiliDanmuParseFromXml(data)
//     console.log(dm)
// });

fs.readFile(json, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data)

    // let dm = bilibiliDanmuParseFromXml(data)
    // console.log(dm)
});

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




