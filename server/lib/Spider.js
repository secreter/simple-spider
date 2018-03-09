/**
 * Created by pengchaoyang on 2018/3/9
 */
const puppeteer = require('puppeteer')
const utils = require('./utils')
const Queue = require('./Queue')
class Spider {
  constructor (page, seed, interval = 5000, maxDeepth = 3) {
    this.seed = seed
    this.interval = 2000
    this.maxDeepth = maxDeepth
    this.page = page
    this.queue = new Queue(true, item => item.url)
    this.historySet = new Set() // 记录爬过的url

    console.log(this.seed)
  }

  async spideUrls (regexList = [], deepth = 0, link = this.seed) {
    if (deepth > this.maxDeepth) return []
    await this.page.goto(link, { timeout: 0 })
    // 休眠，反爬虫，同时为了加载完成
    await utils.sleep(this.interval)
    // 爬取页面所有urls
    let urls = await utils.getPageAHrefs(this.page, deepth)
    // 根据正则过滤urls
    let filtedUrls = regexList.reduce((accumulator, item) => {
      return accumulator.concat(utils.filterUrls(urls, item.regex, x => x.url))
    }, [])
    filtedUrls.forEach(item => {
      this.push(item)
    })
    // 根据正则寻找需要继续爬的urls
    let nextGoUrls = regexList.reduce((accumulator, item) => {
      if (item.go === true) {
        // 从队列中获取并删除
        return accumulator.concat(this.queue.getList(item.regex, true))
      } else {
        return accumulator
      }
    }, [])
    // 这段代码会异步执行，不能保证休眠操作顺序执行，也需要额外处理让浏览器不退出
    // nextGoUrls.forEach(async (item) => {
    //   console.log(item.url)
    //   await this.spideUrls(regexList, deepth++, item.url)
    // })
    for (let i = 0; i < nextGoUrls.length; i++) {
      await this.spideUrls(regexList, deepth++, nextGoUrls[i].url)
    }
    console.log(this.queue.length)
    console.log(deepth)
    this.queue.getList()

    return this.queue
  }

  /**
   * 不能直接用this.queue.push(item)，
   * 需要一个记录爬取历史的集合，爬过的不再爬，用url当集合值
   * @param item
   */
  push (item) {
    if (this.historySet.has(item.url)) {
      return
    }
    this.historySet.add(item.url)
    this.queue.push(item)
  }
}

const main = async () => {
  let browser = await puppeteer.launch({ headless: false })
  let page = await browser.newPage()
  let spider = new Spider(
    page,
    'http://tj.58.com/shangpucz/pn1/?sourcetype=5&area=3000_%2A&sq=1'
  )
  await spider.spideUrls([
    {
      regex:
        'http:\\/\\/tj.58.com\\/shangpucz\\/pn[0-9]+\\/\\?sourcetype=5&area=3000_%2A&sq=1',
      go: true
    },
    {
      regex: 'http:\\/\\/tj.58.com\\/shangpu\\/.+\\.shtml',
      go: false
    }
  ])
  await browser.close()
}
main()
  .then(() => {})
  .catch(e => {
    console.error(e)
  })

// module.exports = Spider
