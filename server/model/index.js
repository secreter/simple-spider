/**
 * Created by So on 2018/3/10.
 */
const mongoose = require('mongoose')
const config = require('../config')
const HouseSchema = require('./HouseSchema')
// 核心代码，是否开启测试
mongoose.set('debug', true)
const dbConn = mongoose.createConnection(config.mongodb.db)
dbConn.on('error', function (err) {
  console.error(
    'mongodb createTaskdbConnection error: ' +
      err +
      ', url: ' +
      config.mongodb.db
  )
})
dbConn.model('House58', HouseSchema)
dbConn.model('Anjuke', HouseSchema)
dbConn.model('Gangjiwang', HouseSchema)
module.exports = dbConn
