
const puppeteer = require('puppeteer')
const utils = require('./lib/utils')
const Queue = require('./lib/queue')
let queue = new Queue(true, (item) => item.url)
const main = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto(
    'http://tj.58.com/shangpucz/pn1/?sourcetype=5&area=3000_%2A&sq=1'
  )
  // await page.goto('http://example.com')
  // await page.screenshot({ path: 'example.png' })
  let urls = await utils.getPageAHrefs(page)
  console.log(urls.length)
  urls.forEach(item => {
    queue.push(item)
  })
  console.log(queue.getQueue().length)

  await browser.close()
}

main()
  .then(() => {})
  .catch(e => {
    console.error(e)
  })
