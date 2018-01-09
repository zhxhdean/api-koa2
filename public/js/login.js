// 用于测试node接口的js 重置
function reset() {
  $('.login>input').val('')
}
// 登录
function login() {
  const username = $('input[name="username"]').val()
  const password = $('input[name="password"]').val()
  if (username && password) {
    $
      .post('/login', {
        username: username,
        password: password
      }, function (data) {
        if (data.code === 0) {
          alert('登录成功')
        } else {
          alert('登录失败')
        }
      })
  } else {
    alert('用户名或密码不能为空')
  }
}
