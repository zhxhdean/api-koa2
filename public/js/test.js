function validate() {
  let token = $('input[name="token"]').val();
  $.post('/valid', {
    token: token
  }, function (data) {
    if(data.code === 10){
      console.log('token错误')
    }else if(data.code === 11){
      console.log('token已过期')
    }else if(data.code === 12){
      console.log('token即将过期')
    }else if(data.code === 0){
      console.log('验证成功')
    }
  })
}
