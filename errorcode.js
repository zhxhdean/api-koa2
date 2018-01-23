module.exports = {
  // 成功
  SUCCESS: 0,
  // 参数为空
  EMPTY_PARAMETERS: 1,
  // 密码错误
  INCORRECT_PASSWORD: 2,

  // 不存在用户
  NO_USER: 20,
  // token错误
  TOKEN_ERROR: 10,
  // token超时
  TOKEN_TIMEOUT_ERROR: 11,
  // token即将过期(属于成功验证token)
  TOKEN_IMMINENT_TIMEOUT:12,
  // 不存在app
  NO_APP: 15,
  // 用户信息更新失败
  CHANGE_USER_FAIL: 30
}
