const cloud = require('wx-server-sdk')

cloud.init()


exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const res = await db.collection('exercises').get()
  return res.data[0]
}