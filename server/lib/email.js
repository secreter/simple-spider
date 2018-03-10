/**
 * Created by So on 2018/3/10.
 */
'use strict'
const nodemailer = require('nodemailer')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const config = require('../config')
// 随机负载均衡
let index = new Date().getTime() % 2
let account = config.emailAccounts[index]
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: account.user, // generated ethereal user
    pass: account.pass // generated ethereal password
  }
})

function sendEmail (dataList) {
  const template = ejs.compile(
    fs.readFileSync(
      path.resolve(__dirname, '..', 'template', 'fangchan.ejs'),
      'utf8'
    )
  )
  // const html = template({
  //   dataList: [{
  //     title: '我与父亲最不想见的人',
  //     desc: '我们过了江，进了车站。我买票，他忙着照看行李。行李太多了，得向脚夫行些小费，才可过去。他便又忙着和他们讲价钱。我那时真是聪明过分，总觉他说话不大漂亮，非自己插嘴不可。但他终于讲定了价钱；就送我上车。他给我拣定了靠车门的一张椅子；我将他给我做的紫毛大衣铺好坐位。他嘱我路上小心，夜里警醒些，不要受凉。又嘱托茶房好好照应我。我心里暗笑他的迂；他们只认得钱，托他们直是白托！而且我这样大年纪的人，难道还不能料理自己么？唉，我现在想想，那时真是太聪明了！我说道，“爸爸，你走吧。”他望车外看了看'
  //   }, {
  //     title: '我与父亲最不想见的人',
  //     desc: '我们过了江，进了车站。我买票，他忙着照看行李。行李太多了，得向脚夫行些小费，才可过去。他便又忙着和他们讲价钱。我那时真是聪明过分，总觉他说话不大漂亮，非自己插嘴不可。但他终于讲定了价钱；就送我上车。他给我拣定了靠车门的一张椅子；我将他给我做的紫毛大衣铺好坐位。他嘱我路上小心，夜里警醒些，不要受凉。又嘱托茶房好好照应我。我心里暗笑他的迂；他们只认得钱，托他们直是白托！而且我这样大年纪的人，难道还不能料理自己么？唉，我现在想想，那时真是太聪明了！我说道，“爸爸，你走吧。”他望车外看了看'
  //   }, {
  //     title: '我与父亲最不想见的人',
  //     desc: '我们过了江，进了车站。我买票，他忙着照看行李。行李太多了，得向脚夫行些小费，才可过去。他便又忙着和他们讲价钱。我那时真是聪明过分，总觉他说话不大漂亮，非自己插嘴不可。但他终于讲定了价钱；就送我上车。他给我拣定了靠车门的一张椅子；我将他给我做的紫毛大衣铺好坐位。他嘱我路上小心，夜里警醒些，不要受凉。又嘱托茶房好好照应我。我心里暗笑他的迂；他们只认得钱，托他们直是白托！而且我这样大年纪的人，难道还不能料理自己么？唉，我现在想想，那时真是太聪明了！我说道，“爸爸，你走吧。”他望车外看了看'
  //   }]
  // })
  const html = template({
    dataList
  })
  // setup email data with unicode symbols
  let mailOptions = {
    from: `"吕总女秘书 👻" <${account.user}>`, // sender address
    to: ', 1979510177@qq.com', // list of receivers
    bcc: 'so@redream.cn', // 抄送
    subject: '南开大学内部消息更新通知', // Subject line
    text: '这是一封重要邮件，收到请回复~谢谢。', // plain text body
    html: html // html body
  }
  console.log(html)
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  })
}
module.exports = sendEmail
