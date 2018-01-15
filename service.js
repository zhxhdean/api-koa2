const {query} = require('./async-db')

module.exports = {
  getApp:async function () {
    let sql = 'select * from app where app_id = ? and token like ? '
    return await query(sql, [1, '%123qw%'])
  },
  // 登录
  login:async function (username) {
    let sql = 'select password from account where username = ?'
    try {
      let result = await query(sql, [username])
      if(result && result.length === 1) {
        return result[0].password
      }
      return ''
    } catch(err) {
      console.log(err)
      return false
    }
    
  },
  // 用户信息
  getUser:async function (username) {
    try {
      const sql = 'select account_id,username,email,phone,company,job from account where username =? limit 1'
      const result = await query(sql, [username])
      if (result && result.length === 1) {
        return result[0]
      }
      return ''
    } catch(err) {
      console.log(err)
      return ''
    }

  }, 
  // 更新用户信息
  setUser:async function (user) {
    try {
      const sql = 'update account set username = ? ,email = ? ,phone = ? ,company = ? ,job = ? where account_id = ?'
      const result = await query(sql, [user.username, user.email, user.phone, user.company, user.job, user.id])
      if(result && result.changedRows === 1){
        return true
      }
      return false
    } catch(err) {
        console.log(err)
        return false
    }
  }
}
