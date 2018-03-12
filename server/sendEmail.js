/**
 * Created by So on 2018/3/12.
 */
const sendEmail = require('./lib/email')
const db = require('./lib/db')
const mian=async ()=>{
  const dataList=await db.getDataList(1,10)
  // console.log(dataList)
sendEmail(dataList)
}
mian().then().catch(e=>{
  console.log(e)
})