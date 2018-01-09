module.exports = {
  cryptoMD5: function(str){
    if(str === ''){
      return ''
    }
    const crypto = require('crypto')
    const md5 = crypto.createHash('md5')
    md5.update(str)
    return md5.digest('hex')
  }
}
