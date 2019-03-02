// const puppeteer = require('puppeteer')
// var path = require('path');
// const fs = require('fs')
// const request = require('request')

const WebRequest = require('web-request')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const port = 3000
// USE THIS APP INSTEAD OF GET IMAGES URL
function Init() {
    app.set('view engine', 'pug');
    app.use(express.static("public"));
    app.listen(port, () => console.log(`app is listening to port ${port}`))

    app.get('/', async (req, res) => {
        if (!req.query.url)
            res.render('index')
        else if (isUrl(req.query.url)) {
            // let imageInfo = await GetImageUrls(req.query.url || 'https://nhentai.net/g/264637/')
            
            let imageInfo = await GetImageUrls(req.query.url)
            // console.log(imageInfo)
            res.render('index', imageInfo)
        } else
            res.render('index', { status: 400, msg: 'Link address is not support' })
    })
}
//TIME AND MEMORY CONSUMPTION
async function GetImageUrlsByPuppeteer(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    const imageInfo = await page.evaluate(() => {
        images = []
        try {
            title = document.querySelector('#info h1').innerText

            document.querySelectorAll('.gallerythumb noscript')
                .forEach(i => images.push(i.innerHTML.split('"')[1].replace('t.', 'i.').replace('t.', '.')))
            return { status: 200, title, imageUrls: images }
        }
        catch (e) {
            return { status: 400, msg: 'Link address is not support' }
        }
    })
    // downloadImagesByUrl(imageInfo.imageUrls, `src/${imageInfo.title}/` , () => {
    //     console.log('done')
    // })

    await browser.close()
    return await imageInfo
}

function isUrl(url) {
    return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(url)
}
// function downloadImagesByUrl(imageUrls, location, callback) {
//     if (!fs.existsSync(location)) {
//         fs.mkdirSync(location);
//     }
//     imageUrls.forEach((imageUrl, i) => {
//         request.head(imageUrl, function (err, res, body) {
//             request(imageUrl)
//                 .pipe(fs.createWriteStream(location + i + '.png'))
//                 .on('close', callback)
//         })
//     })

// }

// GetImageUrls()
// async function ScreenShot() {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()
//     await page.goto('https://google.com.vn')
//     await page.screenshot({ path: 'google.png' })

//     await browser.close()
// }
//FASTER THAT PUPPETEER
async function GetImageUrls(url) {
    images = []
    try {
        var html = await WebRequest.get(url);
        const $ = cheerio.load(html.content)
        let title = $('#info h1').text()
        if( !title )
            throw new Error('Link error')
        $('.thumb-container ').each((i, e) => {
            images.push($('.gallerythumb noscript', e).text()
                .split('"')[1]
                .replace('t.', 'i.')
                .replace('t.', '.'))
        })
        return { status: 200, title, imageUrls: images }
    }
    catch (e) {
        return { status: 400, msg: 'Link address is not support' }
    }
}
module.exports = {
    GetImageUrlsByPuppeteer: GetImageUrlsByPuppeteer,
    Init : Init,
    GetImageUrls : GetImageUrls
}