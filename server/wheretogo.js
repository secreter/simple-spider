/**
 * Created by So on 2018/4/1.
 */
const puppeteer = require('puppeteer')
const utils = require('./lib/utils')
const path = require('path')
// const axios = require('axios')
// const urlencode = require('urlencode')
// const groupName = urlencode('机器人')
const groupName = '海淀小分队'
const main = async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()
  page.setViewport({
    width: 800,
    height: 2500
  })
  await page.goto('https://beijing.douban.com/events/weekend-all')
  await utils.sleep(3000)
  await page.screenshot({
    // fullPage:true,
    clip: {
      x: 0,
      y: 100,
      width: 600,
      height: 2250
    },
    path: path.join(__dirname, './img/wheretogo1.png')
  })
  console.log('get wheretogo1.png')
  // 发送微信消息
  let msgUrl = `http://item.redream.cn:5001/send_img_to_group/${groupName}/wheretogo1.png`
  // await axios.get(msgUrl)
  await page.goto(msgUrl)
  console.log('send ', msgUrl)

  await page.goto('https://beijing.douban.com/events/weekend-all?start=10')
  await utils.sleep(3000)
  await page.screenshot({
    // fullPage:true,
    clip: {
      x: 0,
      y: 100,
      width: 600,
      height: 2250
    },
    path: path.join(__dirname, './img/wheretogo2.png')
  })
  console.log('get wheretogo2.png')

  // 发送微信消息
  msgUrl = `http://item.redream.cn:5001/send_img_to_group/${groupName}/wheretogo2.png`
  // await axios.get(msgUrl)
  await page.goto(msgUrl)
  console.log('send ', msgUrl)
  await browser.close()
}

main()
  .then(() => {
    process.exit()
  })
  .catch(e => {
    console.log('catch')
    console.error(e)
    process.exit() // 异常退出
  })

// module.exports = Spider
