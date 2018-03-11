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
  return new Promise((resolve, reject) => {
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
        return console.log(error)
      }
      console.log('Message sent: %s', info.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
      resolve('success')
    })
  })
}
module.exports = sendEmail
