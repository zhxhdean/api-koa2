const crypto = require('crypto')
// aes加解密key
const key = '2ivDpt3rFd5x7lqh'
module.exports = {
  // md5
  cryptoMD5: function(str){
    if(str === ''){
      return ''
    }
    const md5 = crypto.createHash('md5')
    md5.update(str)
    return md5.digest('hex')
  },
  // aes 加密
  aesEncryption: function(str) {
    let cipher = crypto.createCipheriv('aes-128-ecb', key, '');
    cipher.setAutoPadding(true);
    let cipherChunks = [];
    cipherChunks.push(cipher.update(str, 'utf8', 'base64'));
    cipherChunks.push(cipher.final('base64'));
    return cipherChunks.join('');
  },
  // aes 解密
  aesDecryption: function(str) {
    let cipherChunks = [];
    let decipher = crypto.createDecipheriv('aes-128-ecb', key, '');
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(str, 'base64', 'utf8'));
    cipherChunks.push(decipher.final('utf8'));
    return cipherChunks.join('');
  }
}
