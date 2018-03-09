/**
 * Created by So on 2018/3/8.
 */
/**
 * 工场函数，根据选择器和返回的属性来生成方法
 * 方法可获取页面上所有的指定选择器元素上的url
 * @param selector
 * @param attribute
 */
const getPageUrlsFnGenerator = (selector, attribute) => async (
  page,
  deepth = 0
) => {
  /*
  page的所有方法都在另一个子进程里，无法传递一个方法进去，于是定义方法就定义在子进程内
   */
  let urlList = await page.evaluate(
    (selector, attribute, deepth) => {
      let eles = document.querySelectorAll(selector)
      // console.log(eles)
      eles = [...eles]
      let urls = eles.map(ele => {
        return {
          url: attribute === 'href' ? ele.href : ele.getAttribute(attribute), // 获取的元素链接，有的在data-link,link上，有的在href
          deepth // 爬取深度
        }
      })
      return urls
    },
    selector,
    attribute,
    deepth
  )
  return urlList
}

const getPageAHrefs = getPageUrlsFnGenerator('a[href]', 'href')
const getPageEleLinks = getPageUrlsFnGenerator('[link]', 'link')

/**
 * 根据正则表达式过滤url
 * @param list
 * @param regex
 * @param getKey
 */
const filterUrls = (list, regex, getKey = x => x) => {
  let reg = new RegExp(regex)
  return list.filter(item => {
    return reg.test(getKey(item))
  })
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  getPageAHrefs,
  getPageEleLinks,
  filterUrls,
  sleep
}
