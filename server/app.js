const puppeteer = require('puppeteer')
const utils = require('./lib/utils')
const Queue = require('./lib/Queue')
let queue = new Queue(true, item => item.url)
const main = async () => {
  const browser = await puppeteer.launch({ headless: false })
  // const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    'http://tj.58.com/shangpucz/pn1/?sourcetype=5&area=3000_%2A&sq=1',
    {
      timeout: 0
    }
  )
  // await page.goto('http://example.com')
  // await page.screenshot({ path: 'example.png' })
  let urls = await utils.getPageAHrefs(page)
  console.log(urls.length)
  let pageUrls = utils.filterUrls(
    urls,
    'http:\\/\\/tj.58.com\\/shangpucz\\/pn[0-9]+\\/\\?sourcetype=5&area=3000_%2A&sq=1',
    item => item.url
  )
  let listUrls = utils.filterUrls(
    urls,
    'http:\\/\\/tj.58.com\\/shangpu\\/.+\\.shtml',
    item => item.url
  )

  pageUrls.forEach(item => {
    queue.push(item)
  })
  listUrls.forEach(item => {
    queue.push(item)
  })
  console.log(queue.getQueue().length)
  console.log(queue.getQueue())

  await browser.close()
}

main()
  .then(() => {})
  .catch(e => {
    console.error(e)
  })
