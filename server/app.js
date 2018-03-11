const puppeteer = require('puppeteer')
const utils = require('./lib/utils')
const sendEmail = require('./lib/email')
const Spider = require('./lib/Spider')
const db = require('./lib/db')
const config58 = require('./schema/config58')
const configAnjuke = require('./schema/configAnjuke')
const configGangjiwang = require('./schema/configGangjiwang')
// const INDEX = {
//   HOUSE58: 0,
//   ANJUKE: 3,
//   GANGJIWANG: 1
// }
// configAnjuke 在ubuntu下报Error: net::ERR_TOO_MANY_REDIRECTS
const schemas = [config58, configGangjiwang, configAnjuke]
const main = async () => {
  let browser = await puppeteer.launch({ headless: true })
  let page = await browser.newPage()
  let spider = new Spider(page)
  let sendList = [] // 新增的信息发送邮件
  // let dataList = await spider.start(config_58)
  // length-1 跳过安居客
  for (let i = 1; i < schemas.length - 1; i++) {
    let dataList = await spider.start(schemas[i])

    let oldDataList = await db.getDataList(i)
    let newDataList = utils.uniqueDataList(dataList, oldDataList)
    console.log('dataList.length:', dataList.length)
    db.insertData(newDataList, i)
    console.log('newDataList.length:', newDataList.length)
    sendList = sendList.concat(newDataList)
    console.log('i', i)
  }
  // console.log(sendList)
  if (sendList.length > 0) {
    sendList = sendList.filter(item => {
      // 描述里带酒店、公寓的
      return /酒店|公寓/.test(item.desc)
    })
    await sendEmail(sendList)
  }
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
