/**
 * Created by So on 2018/3/11.
 */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://tj.sp.anjuke.com/zu/from_area3000-p1/')
  await page.screenshot({ path: 'example.png' })

  await browser.close()
})()
