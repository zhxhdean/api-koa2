const {query} = require('./async-db')

module.exports = {
  getApp:async function () {
    let sql = 'select * from app where app_id = ? and token like ? '
    return await query(sql, [1, '%123qw%'])
  },
  // 登录
  login:async function (username) {
    let sql = 'select password from account where username = ?'
    let result = await query(sql, [username]) || ''
    if(result) {
      return result[0].password
    }
    return ''
  }
}
