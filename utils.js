const {aesDecryption, aesEncryption} = require('./cryption')
const {SUCCESS, TOKEN_ERROR, TOKEN_TIMEOUT_ERROR, TOKEN_IMMINENT_TIMEOUT} = require('./errorcode')
module.exports = {
  // 验证token
  validate: function (token) {
    const now = new Date()
    try {
      const decryp = aesDecryption(token).split(':')[1]
      const decryp_time = new Date(decryp)
      // 相差的毫秒
      const sub = now - decryp_time
      if (sub > 12 * 60 * 60 * 1000) {
        // token 过期，有效期12个小时
        return TOKEN_TIMEOUT_ERROR
      } else if (sub > 11 * 60 * 60 * 1000) {
        // token 离过期还有1小时
        return TOKEN_IMMINENT_TIMEOUT
      }
      return SUCCESS
    } catch (err) {
      return TOKEN_ERROR
    }
  },
  // 生成token
  createToken: function (str) {
    try {
      // 当前时间做aes 加密
      let now = new Date()
      // token = username:date
      return aesEncryption(`${str}:${now}`)
    } catch (err) {
      return ''
    }
  },
  // 重新生成token,使用旧的token换新token
  recreateToken: function (old_token) {
    try {
      const decryp = aesDecryption(token).split(':')[0]
      return createToken(decryp)
    } catch (err) {
      return ''
    }
  }
}
