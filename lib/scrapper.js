const puppeteer = require('puppeteer')
const axios = require("axios")

const optionsPuppeteer = [
    '--incognito',
    '--no-sandbox',
    '--single-process',
    '--no-zygote'
]

const lyricsMusixMatch = (req, search) => new Promise(async(resolve, reject) => {
    try{
        var browser = await puppeteer.launch({
            headless: true,
            args: optionsPuppeteer
        })

        if(!search){
            throw {name : "MissingParameter", message : "?q= is required"}; 
        }

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4427.0 Safari/537.36');
        await page.goto(`https://www.musixmatch.com/pt/search/` +  encodeURIComponent(search), {
            waitUntil: 'domcontentloaded'
        })
        
        await page.waitForSelector('h2.media-card-title > a.title', {
            visible: true,
            timeout: 5000
        })

        const link = await page.evaluate(() => {
            return document.querySelector('h2.media-card-title > a.title').getAttribute('href')   
        })
        
        await page.goto(`https://www.musixmatch.com${link}`, {
            waitUntil: 'domcontentloaded'
        })

        await page.waitForSelector('p.mxm-lyrics__content > span.lyrics__content__ok', {
            visible: true,
            timeout: 5000
        })

        const lyrics = await page.evaluate(_ =>
            Array.from(
                document.querySelectorAll('p.mxm-lyrics__content > span.lyrics__content__ok'))
                        .map(lyric => `${lyric.innerText}\n\n`)
        )

        let dimensions = await page.evaluate(() => {
            return {
                title: document.querySelector('h1.mxm-track-title__track').innerText,
                artist: document.querySelector('h2 > span > a.mxm-track-title__artist').innerText,
                img: document.querySelector('div.banner-album-image-desktop > img').getAttribute('src')
            }   
        })

        const loadedData = {
            urlRequest: req.originalUrl,
            title: dimensions.title.substring(dimensions.title.indexOf('\n')+1),
            artist: dimensions.artist,
            img: dimensions.img,
            lyrics: lyrics.join("")
        }

        resolve(loadedData)
    } catch (error) {
        reject(error)
    } finally {
        browser.close()
    }
})

module.exports = {
    lyricsMusixMatch
}